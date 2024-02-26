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

export async function removeObject(indexName: string, objectID: string) {
  const index = initIndex(indexName)
  await index.deleteObject(objectID)
}

export async function profileToAlgolia(profile: any) {
  let hasPlace = !!profile.place
  let cityProfile: any = {}

  if (hasPlace) {
    const cityProfileDocs = (
      await firestore
        .collection('profiles')
        .where('cityPlaceId', '==', profile.place)
        .get()
    ).docs

    if (!cityProfileDocs.length) {
      hasPlace = false
    } else {
      cityProfile = cityProfileDocs[0].data()
      if (!cityProfile.location) {
        hasPlace = false
      }
    }
  }

  const result: any = {
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
    country: hasPlace ? cityProfile.location.country : '',
    locality: hasPlace ? cityProfile.location.locality : '',
    styles: profile.styles,
    style: profile.styles ? Object.keys(profile.styles) : [],
    searchStyle: profile.searchStyle,
    searchLevel: profile.searchLevel,
    role: profile.role,
    story: profile.story,
    partnerBio: profile.partnerBio,
    searchStartedAt: profile.searchStartedAt,
    searchExpiresAt: profile.searchExpiresAt,
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
  }

  if (hasPlace) {
    result._geoloc = {
      lat: cityProfile.location.latitude,
      lng: cityProfile.location.longitude,
    }
  }

  return result
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

  if (event?.venue?.address_components?.length > 0) {
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
    organizer: event.org?.username || '',
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

  if (event?.venue?.address_components?.length > 0) {
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
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  // const now = +new Date()
  // const futureEvents = (
  //   await firestore
  //     .collection('posts')
  //     .where('startDate', '>', now)
  //     .get()
  // ).docs

  const recentlyCreated = (
    await firestore
      .collection('posts')
      .where('createdAt', '>', +since)
      .get()
  ).docs

  const recentlyUpdated = (
    await firestore
      .collection('posts')
      .where('updatedAt', '>', +since)
      .get()
  ).docs

  let eventDocs = [...recentlyCreated, ...recentlyUpdated]
  // get unique events
  eventDocs = eventDocs.filter(
    (event, index, self) =>
      index === self.findIndex((e) => e.data().name === event.data().name)
  )

  console.log({
    count: eventDocs.length,
    since,
    names: eventDocs.map((e: any) => e.data().name).join(', '),
  })

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
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  const recentlyCreated = (
    await firestore
      .collection('profiles')
      .where('createdAt', '>', +since)
      .get()
  ).docs

  const recentlyUpdated = (
    await firestore
      .collection('profiles')
      .where('updatedAt', '>', +since)
      .get()
  ).docs

  let profileDocs = [...recentlyCreated, ...recentlyUpdated]

  // get unique profiles
  profileDocs = profileDocs.filter(
    (profile, index, self) =>
      index ===
      self.findIndex((p) => p.data().username === profile.data().username)
  )

  console.log({
    count: profileDocs.length,
    since,
    usernames: profileDocs.map((p: any) => p.data().username).join(', '),
  })

  const index = initIndex('profiles')

  const objects = []
  const removed = []

  console.log(`Indexing ${profileDocs.length} profiles`)
  let count = 0
  const errors = []

  for (const doc of profileDocs) {
    count++
    const profile = {
      id: doc.id,
      ...doc.data(),
    } as any

    if (!profile.username) {
      await index.deleteObject(profile.id)
      removed.push(profile.id)

      continue
    }

    const algoliaProfile = await profileToAlgolia(profile)
    objects.push(algoliaProfile)
    console.log(
      `Added ${count} of ${profileDocs.length} profiles: ${algoliaProfile.username} in <${algoliaProfile.locality}, ${algoliaProfile.country}> (${algoliaProfile.place})`
    )
    if (!algoliaProfile.locality) {
      errors.push({
        username: algoliaProfile.username,
        place: algoliaProfile.place,
      })
    }
  }

  await index.saveObjects(objects)

  console.log(`Indexed ${objects.length} profiles`)

  if (removed.length) {
    console.log(`Removed ${removed.length} profiles`)
    console.log(removed)
  }

  console.log(`Missing places: ${errors.length}`)
  console.log(errors)
}
