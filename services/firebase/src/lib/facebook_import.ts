import { scrapeFbEvent } from 'facebook-event-scraper'
import { initIndex } from './algolia'
import { firestore } from '../firebase'
import { getCityId, getPlace } from './google_maps'
import { getUploadedImage } from './cloudinary'
import { getSuggestedStyles, getSuggestedType, slugify } from './linguist'

function getDate(timestamp: any) {
  if (!timestamp) {
    return ''
  }

  return timestamp * 1000
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

  // find in firebase
  const docSnaps = await firestore
    .collection('profiles')
    .where('facebook', '==', orgUrl)
    .get()
  if (docSnaps.docs.length > 0) {
    const p: any = { ...docSnaps.docs[0]?.data(), id: docSnaps.docs[0]?.id }

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

    if (username.length > 20) {
      username = slugify(host?.name, 20)
    }

    const now = +new Date()
    const orgPhoto = await getUploadedImage(host?.photo?.imageUri)

    org = {
      createdAt: now,
      importedAt: now,
      updatedAt: now,
      source: 'facebook',
      name: host?.name,
      facebook: orgUrl,
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
      throw new Error(`Username already exists ${username}`)
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

  const eventType = getSuggestedType(event.name + ' ' + event.description)
  const styles = getSuggestedStyles(event.name + ' ' + event.description)

  const hash = getDate(event.startTimestamp) + '+' + venue?.place_id
  const eventPhoto = await getUploadedImage(event.photo?.imageUri || '')

  return {
    name: event.name,
    description: event.description,
    eventType,
    cover: eventPhoto,
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
