import * as puppeteer from 'puppeteer'
import config from '../env'
import axios from 'axios'

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
      executablePath: '/opt/homebrew/bin/chromium',
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

    await page.type('input[name="username"]', config.instagram.username)
    await page.type('input[name="password"]', config.instagram.password)
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

export async function getInstagramApi(instagramUrl: string) {
  const page = await getPage()
  await loginToInstagram(page)

  const response = await page.goto(instagramUrl + '/?__a=1')
  console.log(response.url())
  console.log(await response.text())

  return null
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

export async function getInstagramScraper(instagramUrl: string) {
  const page = await getPage()

  await loginToInstagram(page)

  await page.goto(instagramUrl, { waitUntil: ['networkidle2'] })

  // await delay(2000)

  const profile_pic_url_hd = await page.evaluate(
    `document.querySelector('main header img')?.src`
  )
  const full_name = await page.evaluate(
    `document.querySelector('main header section>div>span').textContent`
  )
  const biography = await page.evaluate(
    `document.querySelectorAll('main header section>div')[1].querySelectorAll('div')[2].textContent`
  )
  let external_url = await page.evaluate(
    `document.querySelector('main header section div a').textContent`
  )

  if (external_url) {
    external_url = 'https://' + external_url
  }

  return {
    profile_pic_url_hd,
    full_name,
    biography,
    external_url,
  }
}

export async function getInstagramFetch(instagramUrl: string) {
  const res = await axios.get(instagramUrl + '/?__a=1')
  console.log(res)
  return res.data.graphql?.user as any
}
