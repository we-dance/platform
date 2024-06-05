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

function addressPart(result: any, type: any) {
  if (!result || !result.address_components) {
    return ''
  }

  const part = result.address_components.find((o: any) =>
    o.types.includes(type)
  )
  if (!part) {
    return ''
  }

  return part.long_name
}

export async function profileToAlgolia(profile: any) {
  let hasAddress = !!profile.address?.place_id
  let hasPlace = !!profile.place
  let cityProfile: any = {}

  if (!hasAddress && hasPlace) {
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

  const reviewsRef = await firestore
    .collection('stories')
    .where('receiver.username', '==', profile.username)
    .get()

  const reviews = reviewsRef.docs.map((doc) => doc.data())
  const reviewsCount = reviews.length

  let reviewsAvg = 0
  if (reviewsCount > 0) {
    reviewsAvg =
      reviews.map((r) => Number(r.stars)).reduce((p, c) => p + c, 0) /
      reviewsCount
  }

  let country = ''
  let locality = ''

  if (hasAddress) {
    country = addressPart(profile.address, 'country')
    locality = addressPart(profile.address, 'locality')
  } else if (hasPlace) {
    country = cityProfile.location.country
    locality = cityProfile.location.locality
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
    reviews,
    reviewsCount,
    reviewsAvg,
    country,
    locality,
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
    venueType: profile.venueType || '',
    amenities: profile.amenities || [],
    visibility: profile.visibility,
    permission: profile.permission,
    lastLoginAt: profile.lastLoginAt,
    createdAt: profile.createdAt,
    daysUsed: profile.daysUsed,
    _tags: profile.styles ? Object.keys(profile.styles) : [],
  }

  if (hasAddress) {
    result._geoloc = {
      lat: profile.address.geometry.location.lat,
      lng: profile.address.geometry.location.lng,
    }
  } else if (hasPlace) {
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
    description: event.description ? event.description.substring(0, 500) : '',
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

export async function indexEvents(onlyNew: boolean = false) {
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  let eventDocs: any[] = []

  if (onlyNew) {
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

    eventDocs = [...recentlyCreated, ...recentlyUpdated]
    // get unique events
    eventDocs = eventDocs.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.data().name === event.data().name)
    )
  } else {
    const now = +new Date()
    const futureEvents = (
      await firestore
        .collection('posts')
        .where('startDate', '>', now)
        .get()
    ).docs

    eventDocs = futureEvents
  }

  console.log({
    count: eventDocs.length,
  })

  const objects = []

  const index = initIndex('events')
  for (const doc of eventDocs) {
    const event = {
      id: doc.id,
      ...doc.data(),
    }

    objects.push(eventToAlgolia(event))
  }

  await index.saveObjects(objects)

  console.log(`Indexed ${objects.length} events`)
}

export async function indexInit() {
  const profilesIndex = initIndex('profiles')
  await profilesIndex.setSettings({
    attributesForFaceting: [
      'style',
      'locality',
      'country',
      'type',
      'gender',
      'objectives',
      'partner',
    ],
  })

  const eventsIndex = initIndex('events')
  await eventsIndex.setSettings({
    attributesForFaceting: [
      'type',
      'style',
      'country',
      'locality',
      'venue',
      'organizer',
      'online',
    ],
  })
}

export async function indexProfiles() {
  const onlyNew = true
  let profileDocs: any[] = []

  if (onlyNew) {
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

    profileDocs = [...recentlyCreated, ...recentlyUpdated]
  } else {
    profileDocs = (await firestore.collection('profiles').get()).docs
  }

  // get unique profiles
  profileDocs = profileDocs.filter(
    (profile, index, self) =>
      index ===
      self.findIndex((p) => p.data().username === profile.data().username)
  )

  console.log({
    count: profileDocs.length,
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
    }

    if (!profile.username) {
      await index.deleteObject(profile.id)
      removed.push(profile.id)

      continue
    }

    const algoliaProfile = await profileToAlgolia(profile)
    objects.push(algoliaProfile)

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
