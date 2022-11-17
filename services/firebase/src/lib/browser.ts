import * as puppeteer from 'puppeteer'

export function delay(time: any) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}

let _browser: puppeteer.Browser
let loggedIn = false

async function getBrowser() {
  if (!_browser) {
    _browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    })
  }

  return _browser
}

export async function closeBrowser() {
  const browser = await getBrowser()
  await browser.close()
}

async function loginToInstagram(page: puppeteer.Page) {
  if (!loggedIn) {
    await page.goto(`https://instagram.com/accounts/login`)

    const [acceptCookiesButton] = await page.$x(
      "//button[contains(., 'Allow')]"
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

    const username = process.env.INSTAGRAM_SCRAPER_USERNAME as string
    const password = process.env.INSTAGRAM_SCRAPER_PASSWORD as string

    await page.type('input[name="username"]', username)
    await page.type('input[name="password"]', password)
    await page.click('button[type="submit"]')

    await page.waitForNavigation()
    loggedIn = true
  }
}

async function getPage() {
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

  return page
}

export async function getInstagramWebProfileInfo(
  instagramUrl: string
): Promise<any> {
  const page = await getPage()
  await loginToInstagram(page)

  let result

  page.on('response', async (response) => {
    if (response.url().includes('web_profile_info')) {
      const res = await response.json()
      result = res.data.user
    }
  })

  await page.goto(instagramUrl, { waitUntil: ['networkidle2'] })

  return result
}
