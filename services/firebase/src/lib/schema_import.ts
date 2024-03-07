const WAE = require('web-auto-extractor').default
const TurndownService = require('turndown')
import { decode } from 'html-entities'
import axios from 'axios'
import { getCityId, getPlace } from './google_maps'
import { getUploadedImage } from './cloudinary'
import {
  getSuggestedStyles,
  getSuggestedType,
  getUrlsFromText,
  isFacebookEvent,
} from './linguist'

async function getEvent(url: string) {
  const response = await axios.get(url)
  const data = response.data
  const facebookUrlsList = getUrlsFromText(data)
    .filter((url) => isFacebookEvent(url))
    .filter((v, i, a) => a.indexOf(v) === i)

  const parsed = WAE().parse(data)

  const result = []

  if (parsed.jsonld.Event) {
    for (const event of parsed.jsonld.Event) {
      result.push(event)
    }
  }

  if (parsed.jsonld.SocialEvent) {
    for (const event of parsed.jsonld.SocialEvent) {
      result.push(event)
    }
  }

  if (parsed.microdata.Event) {
    for (const event of parsed.microdata.Event) {
      result.push(event)
    }
  }

  const event = result[0]
  event.facebookUrlsCount = facebookUrlsList.length
  event.facebookUrlsList = facebookUrlsList
  event.schemaEventsCount = result.length
  event.facebook = facebookUrlsList.length > 0 ? facebookUrlsList[0] : ''

  return event
}

export async function getSchemaEvent(url: string) {
  const event = await getEvent(url)
  if (!event) {
    return {
      type: 'import_error',
      errorCode: 'no_event',
      error: 'No event found',
    }
  }

  event.name = decode(event.name)
  const turndownService = new TurndownService()
  event.description = turndownService.turndown(decode(event.description))

  const venueName = event.location?.name || ''
  const venueAddress = event.location?.address?.streetAddress || ''
  const venueCountry = event.location?.addressCountry?.addressCountry || ''

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

  let eventType = getSuggestedType(event.name + ' ' + event.description)

  // how many days the event is
  const days =
    (+new Date(event.endDate) - +new Date(event.startDate)) /
    (1000 * 60 * 60 * 24)

  if (days > 1) {
    eventType = 'Festival'
  }

  const styles = getSuggestedStyles(event.name + ' ' + event.description)

  const hash = +new Date(event.startDate) + '+' + venue?.place_id
  const eventPhoto = await getUploadedImage(event.image || '')

  const offer = event.offers?.find((offer: any) => offer.price) || null

  return {
    name: event.name,
    description: event.description,
    eventType,
    cover: eventPhoto,
    startDate: +new Date(event.startDate),
    endDate: +new Date(event.endDate),
    venue,
    place,
    price: offer ? `${offer.price} ${offer.priceCurrency}` : '',
    link: Array.isArray(event.url) ? event.url[0] : event.url || '',
    type: 'event',
    visibility: 'Public',
    form: 'No',
    online: 'No',
    international: 'No',
    claimed: 'No',
    duration: 60,
    styles,
    artists: [],
    org: '', // can we get it from event.organizer
    program: [],
    watch: {
      count: 0,
      usernames: [],
    },
    hash,
    source: 'schema',
    facebookUrlsCount: event.facebookUrlsCount,
    facebookUrlsList: event.facebookUrlsList,
    schemaEventsCount: event.schemaEventsCount,
    facebook: event.facebook,
  }
}
