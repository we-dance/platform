import { getPage } from './browser'
import { parse, isAfter, addYears, differenceInMonths } from 'date-fns'
import { es } from 'date-fns/locale'
const TurndownService = require('turndown')
import { decode } from 'html-entities'
import { firestore } from '../firebase'
import { getCityId, getPlace } from './google_maps'
import { getSuggestedStyles, getSuggestedType } from './linguist'
import { getUploadedImage } from './cloudinary'

require('dotenv').config()

const email = String(process.env.GOANDANCE_EMAIL)
const pass = String(process.env.GOANDANCE_PASSWORD)

const turndownService = new TurndownService()

export async function goandance() {
  const events = await getEvents()
  await saveEvents(events)
}

async function getEvents() {
  console.log('List of events')
  const page = await getPage()
  await page.goto(
    'https://www.goandance.com/es/usuarios/registrarse?back=/es/area-profesionales/afiliados/events',
    { waitUntil: 'networkidle0' }
  )
  await page.waitForSelector('.btn-goandance.btn-lg')
  await page.click('.btn-goandance.btn-lg')
  await page.waitForSelector('#formWebloginEmail')
  await page.waitForSelector('#formWebloginPass')

  await page.type('#formWebloginEmail', email, { delay: 10 })
  await page.type('#formWebloginPass', pass, { delay: 10 })
  await page.type('#formWebloginEmail', email, { delay: 10 })
  await page.click('#formWeblogin button[type=submit]')
  await page.waitForNavigation()

  const events = await page.evaluate(() => {
    const suffix = '?promoter=WEDANCE123'

    const events: any = []
    const divs = document.querySelectorAll('.affiliate-event')

    for (const event of divs) {
      const viewUrl =
        'https://www.goandance.com' +
          event.querySelector('h2 a')?.getAttribute('href') || ''
      const id = viewUrl.match(/event\/(\d+)/)?.[1]
      const url = 'https://www.goandance.com/es/e/' + id + suffix

      const name = event.querySelector('h2 a')?.textContent?.trim()
      const comission = Number(
        event
          .querySelector('.commission .price')
          ?.textContent?.trim()
          ?.replace(',', '.')
          .replace(/[^\d.-]/g, '') || 0
      )
      const item = { id, url, name, comission, viewUrl }

      events.push(item)
    }

    return events
  })

  for (let i = 0; i < events.length; i++) {
    console.log(`Processing ${i + 1} of ${events.length} event`)
    const event = events[i]
    await page.goto(event.url)

    await page.goto(event.url)

    const showMore = await page.$('#event-description .show-more-action')
    if (showMore) {
      await showMore.click()
    }
    await page.click('#event-organizer a[data-toggle=collapse]')
    const data = await page.evaluate(() => {
      const event: any = {}
      event.startDate = document
        .querySelector('meta[itemprop=startDate]')
        ?.getAttribute('content')

      event.endDate = document
        .querySelector('meta[itemprop=endDate]')
        ?.getAttribute('content')

      event.cover = document
        .querySelector('.enlarge-image')
        ?.getAttribute('href')

      event.organizer = {
        contacts: [],
      }

      const photo = document
        .querySelector('#event-organizer img')
        ?.getAttribute('src')

      if (photo) {
        event.organizer.photo = 'https://www.goandance.com' + photo
      }

      const links = [
        ...document.querySelectorAll('#organizer-contact a'),
      ].map((a) => a?.getAttribute('href'))

      for (const link of links) {
        event.organizer.contacts.push(link)
      }

      event.venue = {}
      event.venue.place = document
        .querySelector('#event-map .address .place')
        ?.textContent?.trim()
      event.venue.street = document
        .querySelector('#event-map .address .street')
        ?.textContent?.trim()
      event.venue.city = document
        .querySelector('#event-map .address .city')
        ?.textContent?.trim()
      event.venue.state = document
        .querySelector('#event-map .address .state')
        ?.textContent?.trim()

      event.links = []
      const eventLinks = [
        ...document.querySelectorAll('#event-links a'),
      ].map((a) => a.getAttribute('href'))
      for (const eventLink of eventLinks) {
        event.links.push(eventLink)
      }

      event.description =
        document
          .querySelector('#event-description .profile-description')
          ?.innerHTML?.trim() || ''

      const ticketDivs = document.querySelectorAll('.ticket-row')
      event.tickets = []

      for (const ticketDiv of ticketDivs) {
        const ticket: any = {}
        ticket.price = ticketDiv.getAttribute('data-price')
        ticket.originalPrice = ticketDiv.getAttribute('data-original-price')
        ticket.priceCurrency = ticketDiv
          .querySelector('[itemprop=priceCurrency]')
          ?.getAttribute('content')
        ticket.priceValidUntil = ticketDiv
          .querySelector('[itemprop=priceValidUntil]')
          ?.getAttribute('content')
        ticket.validFrom = ticketDiv
          .querySelector('[itemprop=validFrom]')
          ?.getAttribute('content')
        ticket.url = ticketDiv
          .querySelector('[itemprop=url]')
          ?.getAttribute('content')
        ticket.availability = ticketDiv
          .querySelector('[itemprop=availability]')
          ?.getAttribute('href')
        ticket.fee = ticketDiv.getAttribute('data-fee')
        ticket.name = ticketDiv
          .querySelector('[itemprop=name]')
          ?.textContent?.trim()
        ticket.description =
          ticketDiv.querySelector('.description')?.textContent?.trim() || ''
        event.tickets.push(ticket)
      }

      return event
    })
    await page.goto(event.viewUrl)

    const ticketsPromoter = await page.evaluate(() => {
      const tickets = []
      const rows = document.querySelectorAll('.table tr')
      let currentName = ''
      let rowSpan = 1
      let startCol = 0
      for (const row of rows) {
        const cols = row.querySelectorAll('td')
        if (!cols.length) {
          continue
        }

        if (rowSpan > 1) {
          startCol = -1
          rowSpan -= 1
        } else {
          rowSpan = Number(cols[0]?.getAttribute('rowspan') || 0)
          currentName = cols[0]?.textContent?.trim() || ''
          startCol = 0
        }

        const name = currentName
        const price = cols[startCol + 1]?.textContent?.trim() || ''
        const priceValidUntil = cols[startCol + 2]?.textContent?.trim() || ''
        const discount = cols[startCol + 3]?.textContent?.trim() || ''
        const promoterPrice = cols[startCol + 4]?.textContent?.trim() || ''
        const comission = cols[startCol + 5]?.textContent?.trim() || ''

        tickets.push({
          name,
          price,
          priceValidUntil,
          discount,
          promoterPrice,
          comission,
        } as any)
      }
      return tickets
    })

    for (const ticket of ticketsPromoter) {
      let priceValidUntil = parse(
        ticket.priceValidUntil,
        'dd MMM HH:mm',
        new Date(),
        {
          locale: es,
        }
      )
      const now = new Date()

      if (
        !isAfter(priceValidUntil, now) &&
        differenceInMonths(now, priceValidUntil) > 3
      ) {
        priceValidUntil = addYears(priceValidUntil, 1)
      }

      ticket.priceValidUntil = priceValidUntil
    }

    const tickets: any[] = []

    for (const ticket of data.tickets) {
      ticketsPromoter
        .filter((t) => t.name === ticket.name)
        .forEach((t) => {
          const r = {
            name: decode(ticket.name),
            description: decode(ticket.description) || '',
            priceValidUntil: t.priceValidUntil,
            discount: Number(
              t.discount?.replace(',', '.').replace(/[^\d.-]/g, '')
            ),
            price: Number(
              t.promoterPrice?.replace(',', '.').replace(/[^\d.-]/g, '')
            ),
            comission: Number(
              t.comission?.replace(',', '.').replace(/[^\d.-]/g, '')
            ),
            originalPrice: Number(
              t.price?.replace(',', '.').replace(/[^\d.-]/g, '')
            ),
            priceCurrency: ticket.priceCurrency,
            url: ticket.url,
          }
          tickets.push(r)
        })
    }

    data.tickets = tickets
    data.name = decode(event.name)
    data.description = turndownService.turndown(decode(data.description)) || ''

    events[i] = { ...event, ...data }
  }

  return events
}

async function saveEvents(events: any[]) {
  for (let i = 0; i < events.length; i++) {
    const item = events[i]

    console.log(`Saving ${i + 1} of ${events.length} event`)

    const now = +new Date()

    let venue: any = ''

    if (item.venue) {
      venue = await getPlace(item.venue.place + ' ' + item.venue.city)
    }

    if (!venue?.place_id) {
      venue = ''
    }

    let place: any = ''

    if (venue) {
      place = await getCityId(venue)
    }

    let eventType = getSuggestedType(item.name + ' ' + item.description)

    // how many days the event is
    const days =
      (+new Date(item.endDate) - +new Date(item.startDate)) /
      (1000 * 60 * 60 * 24)

    if (days > 1) {
      eventType = 'Festival'
    }

    const styles = getSuggestedStyles(item.name + ' ' + item.description)

    const hash = +new Date(item.startDate) + '+' + venue?.place_id
    const cover = await getUploadedImage(item.cover || '')

    const org = await getOrg(item.organizer, place)

    const mainTicket = item.tickets?.find((t: any) => {
      const ticketDate = new Date(t.priceValidUntil)
      const now = new Date()
      return ticketDate > now
    })

    let price = ''
    if (mainTicket) {
      price = `${mainTicket.price} ${mainTicket.priceCurrency}`
    }

    // @ts-ignore
    const event: any = {
      provider: 'goandance',
      createdAt: now,
      updatedAt: now,
      importedAt: now,
      providerId: 'goandance',
      providerItemId: item.id,
      name: item.name,
      description: item.description,
      sourceUrl: item.url,
      link: item.url,
      type: 'event',
      startDate: +new Date(item.startDate),
      endDate: +new Date(item.endDate),
      tickets: item.tickets,
      eventType,
      cover,
      venue,
      place,
      price,
      styles,
      artists: [],
      program: [],
      watch: {
        count: 0,
        usernames: [],
      },
      hash,
      org,
    }

    const existingEvents = await firestore
      .collection('posts')
      .where('hash', '==', hash)
      .get()

    if (existingEvents.docs.length > 0) {
      const existingEvent: any = {
        ...existingEvents.docs[0].data(),
        id: existingEvents.docs[0].id,
      }

      if (existingEvent.provider !== 'goandance') {
        console.log(
          `- Replacing ${existingEvent.provider}: ${existingEvent.name}`
        )
        await firestore
          .collection('posts')
          .doc(existingEvent.id)
          .delete()
      } else {
        console.log(`- Skipping ${existingEvent.name}`)
        continue
      }
    }

    await firestore.collection('posts').add(event)
  }
}

async function getOrg(organizer: any, place: any) {
  let org: any = ''

  if (!organizer?.contacts) {
    console.log('- Org: no contacts')
    return ''
  }

  let instagramUrl = organizer.contacts.find((l: any) =>
    l.includes('instagram.com')
  )
  instagramUrl = instagramUrl?.replace(/\/profilecard.*$/, '')
  if (!instagramUrl) {
    console.log('- Org instagram not found', organizer?.contacts)
    return ''
  }

  // find in firebase
  const docSnaps = await firestore
    .collection('profiles')
    .where('instagram', '==', instagramUrl)
    .get()
  if (docSnaps.docs.length > 0) {
    const p: any = { ...docSnaps.docs[0]?.data(), id: docSnaps.docs[0]?.id }
    console.log('- Org: found instagram')
    org = {
      id: p.id,
      username: p.username,
      name: p.name || p.username || '',
      photo: p.photo || '',
      bio: p.bio || '',
      instagram: p.instagram || '',
      facebook: p.facebook || '',
      tiktok: p.tiktok || '',
      youtube: p.youtube || '',
    }
  } else {
    let username = instagramUrl
      ?.replace('https://www.instagram.com/', '')
      .replace('/', '')

    const now = +new Date()
    const orgPhoto = await getUploadedImage(organizer?.photo)

    org = {
      createdAt: now,
      importedAt: now,
      updatedAt: now,
      source: 'instagram',
      name: username,
      instagram: instagramUrl,
      photo: orgPhoto,
      username,
      type: 'Organiser',
      owned: false,
      owner: '',
      import: 'success',
      visibility: 'Public',
    }

    if (place) {
      org.place = place
    }

    // check if username alredy exists
    const usernameExists = await firestore
      .collection('profiles')
      .where('username', '==', username)
      .get()

    if (usernameExists.docs.length > 0) {
      const p: any = {
        ...usernameExists.docs[0]?.data(),
        id: usernameExists.docs[0]?.id,
      }

      org = {
        id: p.id,
        username: p.username,
        name: p.name || p.username || '',
        photo: p.photo || '',
        bio: p.bio || '',
        instagram: p.instagram || '',
        facebook: p.facebook || '',
        tiktok: p.tiktok || '',
        youtube: p.youtube || '',
      }

      console.log('- Org: found username')

      return org
    }

    console.log('- Org: creating')
    await firestore.collection('profiles').add(org)
  }

  return org
}
