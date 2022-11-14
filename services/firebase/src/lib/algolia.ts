import algoliasearch from 'algoliasearch'
import { firestore } from '../firebase'
require('dotenv').config()

export function initIndex(indexName: string) {
  const algolia = algoliasearch(
    String(process.env.ALGOLIA_APP_ID),
    String(process.env.ALGOLIA_API_KEY)
  )
  return algolia.initIndex(indexName)
}

export async function removeObject(objectID: string) {
  const index = initIndex('profiles')
  await index.deleteObject(objectID)
}

export function profileToAlgolia(profile: any, cache: any) {
  const hasPlace = profile.place && cache.cities && cache.cities[profile.place]

  return {
    objectID: profile.id,
    id: profile.id,
    username: profile.username,
    name: profile.name,
    instagram: profile.instagram,
    facebook: profile.facebook,
    photo: profile.photo,
    height: profile.height,
    weight: profile.weight,
    bio: profile.bio,
    locales: profile.locales ? Object.keys(profile.locales) : [],
    place: profile.place,
    country: hasPlace ? cache.cities[profile.place].location.country : '',
    locality: hasPlace ? cache.cities[profile.place].location.locality : '',
    styles: profile.styles,
    style: profile.styles ? Object.keys(profile.styles) : [],
    partner: profile.partner,
    objectives: profile.objectives ? Object.keys(profile.objectives) : [],
    gender: profile.gender,
    type: profile.type,
    visibility: profile.visibility,
    permission: profile.permission,
    lastLoginAt: profile.lastLoginAt,
    createdAt: profile.createdAt,
    daysUsed: profile.daysUsed,
    _tags: profile.styles ? Object.keys(profile.styles) : [],
    _geoloc: {
      lat: hasPlace ? cache.cities[profile.place].location.latitude : '',
      lng: hasPlace ? cache.cities[profile.place].location.longitude : '',
    },
  }
}

export function eventForApi(event: any) {
  let result = {
    id: event.id,
    url: 'https://wedance.vip/events/' + event.id,
    organizer: 'https://wedance.vip/' + event.org.username,
    name: event.name,
    cover: event.cover,
    description: event.description,
    price: event.price,
    styles: event.styles ? Object.keys(event.styles) : [],
    type: event.eventType,
    online: event.online === 'Yes' ? true : false,
    createdAt: new Date(event.createdAt),
    updatedAt: new Date(event.updatedAt),
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  }

  if (event.venue) {
    const venue = {
      venue: event.venue.name,
      address: event.venue.formatted_address,
      locality:
        event.venue.address_components.find((c: any) =>
          c.types.includes('locality')
        )?.long_name || '',
      country:
        event.venue.address_components.find((c: any) =>
          c.types.includes('country')
        )?.long_name || '',
      location: {
        lat: event.venue?.geometry.location.lat,
        lng: event.venue?.geometry.location.lng,
      },
    }
    result = { ...result, ...venue }
  }

  return result
}

export function eventToAlgolia(event: any) {
  let result = {
    objectID: event.id,
    id: event.id,
    organizer: event.org.username,
    name: event.name,
    cover: event.cover,
    description: event.description,
    place: event.place,
    price: event.price,
    styles: event.styles,
    style: event.styles ? Object.keys(event.styles) : [],
    type: event.eventType,
    createdAt: event.createdAt,
    startDate: +new Date(event.startDate),
    endDate: +new Date(event.endDate),
    online: event.online,
    _tags: event.styles ? Object.keys(event.styles) : [],
  }

  if (event.venue) {
    const venue = {
      venue: event.venue.name,
      address: event.venue.formatted_address,
      locality:
        event.venue.address_components.find((c: any) =>
          c.types.includes('locality')
        )?.long_name || '',
      country:
        event.venue.address_components.find((c: any) =>
          c.types.includes('country')
        )?.long_name || '',
      _geoloc: {
        lat: event.venue?.geometry.location.lat,
        lng: event.venue?.geometry.location.lng,
      },
    }
    result = { ...result, ...venue }
  }

  return result
}

export async function indexEvents() {
  const eventDocs = (
    await firestore
      .collection('posts')
      .where('startDate', '>', '2022-11-05')
      .get()
  ).docs

  const objects = []

  const index = initIndex('events')
  for (const doc of eventDocs) {
    const event = {
      id: doc.id,
      ...doc.data(),
    } as any

    objects.push(eventToAlgolia(event))
  }

  await index.saveObjects(objects)

  console.log(`Indexed ${objects.length} events`)
}

export async function indexProfiles() {
  const cache = (
    await firestore
      .collection('app')
      .doc('v2')
      .get()
  ).data() as any

  const index = initIndex('profiles')

  const profileDocs = (await firestore.collection('profiles').get()).docs
  const objects = []
  const removed = []

  for (const doc of profileDocs) {
    const profile = {
      id: doc.id,
      ...doc.data(),
    } as any

    if (!profile.username) {
      await index.deleteObject(profile.id)
      removed.push(profile.id)

      continue
    }

    objects.push(profileToAlgolia(profile, cache))
  }

  await index.saveObjects(objects)

  console.log(`Indexed ${objects.length} profiles`)

  if (removed.length) {
    console.log(`Removed ${removed.length} profiles`)
    console.log(removed)
  }
}
