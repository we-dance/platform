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

export const slugify = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, '')

  // Make the string lowercase
  str = str.toLowerCase()

  // Remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa......'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  // Remove invalid chars
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by .
    .replace(/\s+/g, '.')
    // Collapse dots
    .replace(/\.+/g, '.')

  return str
}

async function getOrg(host: any, place: any) {
  let org: any = ''

  if (!host?.id) {
    return ''
  }

  let orgUrl = host.url || ''
  if (!orgUrl) {
    orgUrl = `https://www.facebook.com/${host?.id}`
  }

  const orgFacebook = orgUrl.replace('https://www.facebook.com/', '')
  if (!orgFacebook) {
    return ''
  }

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
    let username = orgFacebook

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
      facebook: orgUrl,
      photo: host?.photo?.imageUri,
      username: slugify(host?.name),
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

  if (venueName) {
    venue = await getPlace(venueName, venueCountry || 'de')
  }

  if (!venue?.place_id && venueAddress) {
    venue = await getPlace(venueAddress, venueCountry || 'de')
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
