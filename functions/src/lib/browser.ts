import * as puppeteer from 'puppeteer'
import config from '../env'

function getBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}

let loggedIn = false

export async function getInstagram(username: string) {
  const browser = await getBrowser()

  const page = await browser.newPage()

  await page.setExtraHTTPHeaders({
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'upgrade-insecure-requests': '1',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,en;q=0.8',
  })

  if (!loggedIn) {
    await page.goto(`https://instagram.com/accounts/login`)

    const [acceptCookiesButton] = await page.$x(
      "//button[contains(., 'Accept All')]"
    )

    if (!acceptCookiesButton) {
      throw new Error('Could not find accept cookies button')
    }

    await acceptCookiesButton.click()

    await page.waitForSelector('[role=dialog]', {
      hidden: true,
    })

    await page.waitForSelector('input[name="username"]', {
      visible: true,
    })

    await page.type('input[name="username"]', config.instagram.username)
    await page.type('input[name="password"]', config.instagram.password)
    await page.click('button[type="submit"]')

    await page.waitForNavigation()
    loggedIn = true
  }

  const response = await page.goto(`https://instagram.com/${username}`)
  const isLoginRequested = response?.url().includes('/accounts/login')

  if (isLoginRequested) {
    await browser.close()

    throw Error('Login required')
  }

  const isUsernameNotFound = await page.evaluate(
    `document.getElementsByTagName('h2')[0]?.textContent == "Sorry, this page isn't available."`
  )

  if (isUsernameNotFound) {
    await browser.close()

    return
  }

  const user = await page.evaluate(
    `window._sharedData?.entry_data.ProfilePage[0].graphql.user`
  )

  await browser.close()

  return user
}
