import * as puppeteer from 'puppeteer'

function getBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

export default async (
  url: string,
  config?: puppeteer.BinaryScreenShotOptions
) => {
  const browser = await getBrowser()

  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1080 })
  await page.goto(url, { waitUntil: 'networkidle2' })

  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll('img'))
    await Promise.all(
      selectors.map((img) => {
        if (img.complete) return
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve)
          img.addEventListener('error', reject)
        })
      })
    )
  })

  const buffer = await page.screenshot(config)

  await browser.close()

  return buffer
}
