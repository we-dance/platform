import { getPage } from './browser'
import { firestore } from '../firebase'

export async function latindancecalendar() {
  const events = await getFacebookEvents()
  await saveEvents(events)
}

async function getFacebookEvents(): Promise<string[]> {
  const page = await getPage()
  await page.goto('https://latindancecalendar.com/festivals/')

  const eventsWithFacebook = await page.evaluate(() => {
    const filteredEvents: any = []
    const events = document.querySelectorAll('.vevent')

    for (const event of events) {
      const facebookUrl = event
        .querySelector('a.outbound.festivals.quicklink.event')
        ?.getAttribute('href')
      if (!facebookUrl?.includes('facebook.com/events/')) {
        continue
      }
      const url = event
        .querySelector('a.inbound.festivals.link.url.summary')
        ?.getAttribute('href')
      const name = event.querySelector('a.inbound.festivals.link.url.summary')
        ?.textContent
      const item = { facebookUrl, url, name }

      filteredEvents.push(item)
    }

    return filteredEvents
  })

  await page.close()
  return eventsWithFacebook
}

async function saveEvents(events: any[]) {
  const now = +new Date()
  for (const item of events) {
    const event: any = {
      provider: `latindancecalendar`,
      createdAt: now,
      updatedAt: now,
      importedAt: now,
      providerId: 'latindancecalendar',
      providerItemId: item.url,
      name: item.name,
      facebook: item.facebookUrl,
      sourceUrl: item.facebookUrl,
      type: 'import_event',
    }
    await firestore.collection('posts').add(event)
  }
}
