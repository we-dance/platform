import { scrapeFbEvent } from 'facebook-event-scraper'
import { initIndex } from './algolia'
import { firestore } from '../firebase'
import { getCityId, getPlace } from './google_maps'
import { getStyles } from './dance_styles'

function getDate(timestamp: any) {
  if (!timestamp) {
    return ''
  }

  return timestamp * 1000
}

async function getOrg(host: any, place: any) {
  let org: any = ''

  const orgFacebook = host?.url.replace('https://www.facebook.com/', '')

  const orgResults = await initIndex('profiles').search(orgFacebook)
  if (orgResults.hits.length) {
    const p = orgResults.hits[0] as any

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
    let username = host?.url.replace('https://www.facebook.com/', '')

    if (username.includes('people/')) {
      username = username.split('/')[1].replace('-', '')
    }

    const now = +new Date()

    org = {
      createdAt: now,
      importedAt: now,
      updatedAt: now,
      source: 'facebook',
      name: host?.name,
      facebook: host?.url,
      photo: host?.photo?.imageUri,
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

    await firestore.collection('profiles').add(org)
  }

  return org
}

export async function getFacebookEvent(url: string) {
  let event
  try {
    event = await scrapeFbEvent(url)
  } catch (e) {
    return {
      type: 'import_error',
      error: (e as Error).message,
    }
  }

  const venueName = event.location?.name || ''
  const venueAddress = event.location?.address || ''
  const venueCountry = event.location?.countryCode || ''

  let venue: any = ''

  if (venueName || venueAddress) {
    venue = await getPlace(`${venueName} ${venueAddress}`, venueCountry || 'de')
  }

  let place: any = ''

  if (!venue?.place_id) {
    venue = ''
  }

  if (venue) {
    place = await getCityId(venue)
  }

  const org = await getOrg(event.hosts[0], place)

  if (!venue) {
    venue = await getPlace(org.name, 'de')
  }

  if (venue && !place) {
    place = await getCityId(venue)
  }

  const description = event.description.toLowerCase()

  let eventType = 'Party'
  const eventTypes = [
    'Course',
    'Workshop',
    'Party',
    'Festival',
    'Congress',
    'Concert',
  ]

  for (const e of eventTypes) {
    if (description.includes(e.toLowerCase())) {
      eventType = e
    }
  }

  const stylesList: any = getStyles()
  const styles: any = {}

  for (const style of stylesList) {
    if (description.includes(style.name.toLowerCase())) {
      styles[style.id] = {
        level: 'Interested',
        highlighted: false,
        selected: true,
      }
    }
  }

  const hash = getDate(event.startTimestamp) + '+' + venue?.place_id

  return {
    name: event.name,
    description: event.description,
    eventType,
    cover: event.photo?.imageUri,
    startDate: getDate(event.startTimestamp),
    endDate: getDate(event.endTimestamp),
    venue,
    place,
    link: event.ticketUrl || '',
    type: 'event',
    visibility: 'Public',
    form: 'No',
    online: 'No',
    international: 'No',
    claimed: 'No',
    duration: 60,
    price: '',
    styles,
    artists: [],
    org,
    program: [],
    watch: {
      count: 0,
      usernames: [],
    },
    facebook: event.url,
    facebookId: event.id,
    hash,
    source: 'facebook',
  }
}
