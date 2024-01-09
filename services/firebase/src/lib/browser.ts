import * as puppeteer from 'puppeteer'

export function delay(time: any) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}

let _browser: puppeteer.Browser

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

export async function getPage() {
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
