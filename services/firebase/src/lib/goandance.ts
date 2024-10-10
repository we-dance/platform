import { getPage } from './browser'

export async function goandance() {
  const page = await getPage()
  await page.goto(
    'https://www.goandance.com/es/usuarios/registrarse?back=/es/area-profesionales/afiliados/events'
  )
  await page.click('a[data-target="#login-popup"]')
  await page.waitForSelector('input[name="email"]')
  await page.type('input[name="email"]', 'x')
  await page.type('input[name="pass"]', 'x')
  await page.click('input[type="submit"]')
  await page.waitForNavigation()
  await page.close()
}
