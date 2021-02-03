import * as puppeteer from 'puppeteer'
import * as admin from 'firebase-admin'

export default async (username: string) => {
  try {
    const imageBuffer: string = await generateScreenShot(
      `https://wedance.vip/u/${username}/share`
    )

    await saveScreenShot(imageBuffer, username)
  } catch (err) {
    console.error(err)
  }
}

function generateScreenShot(url: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

      const page = await browser.newPage()

      // Screenshot size
      await page.setViewport({ width: 1080, height: 1080 })

      // Go to your website
      await page.goto(url)

      // Disable service workers
      await (page as any)._client.send('ServiceWorker.enable')
      await (page as any)._client.send('ServiceWorker.stopAllWorkers')

      // Wait for a particular components to be loaded
      await page.waitForFunction('document.querySelector("#canvas img")')

      // Take the screenshot
      const imageBuffer: string = await page.screenshot()

      await browser.close()

      resolve(imageBuffer)
    } catch (err) {
      reject(err)
    }
  })
}

function saveScreenShot(
  imageBuffer: string,
  username: string
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    if (!imageBuffer || imageBuffer === '') {
      reject('No screenshot')
      return
    }

    try {
      // We get the instance of our default bucket
      const bucket = admin.storage().bucket()
      const url = `share/profile/${username}.png`

      // Create a file object
      const file = bucket.file(url)

      // Save the image
      await file.save(imageBuffer)

      resolve(url)
    } catch (err) {
      reject(err)
    }
  })
}
