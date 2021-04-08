import algoliasearch from 'algoliasearch'
// @ts-ignore
import { firestore } from './firebase'
import env from './env'

const algolia = algoliasearch(env.algolia.appId, env.algolia.apiKey)

async function indexProfiles() {
  const cache = (
    await firestore
      .collection('app')
      .doc('v2')
      .get()
  ).data() as any

  const profileDocs = (await firestore.collection('profiles').get()).docs
  console.log(`Found ${profileDocs.length} profiles`)

  const index = algolia.initIndex('profiles')

  for (let doc of profileDocs) {
    const profile = {
      id: doc.id,
      ...doc.data()
    } as any

    console.log(`Processing ${profile.id} `)

    if (
      !profile.username ||
      !profile.place ||
      !profile.objectives ||
      !profile.styles
    ) {
      await index.deleteObject(profile.id)
      console.log(`Deleted`)
      continue
    }

    await index.saveObject({
      objectID: profile.id,
      id: profile.id,
      username: profile.username,
      photo: profile.photo,
      height: profile.height,
      weight: profile.weight,
      bio: profile.bio,
      locales: Object.keys(profile.locales),
      location: cache.cities[profile.place].location,
      styles: Object.keys(profile.styles),
      objectives: Object.keys(profile.objectives),
      gender: profile.gender,
      type: profile.type,
      lastLoginAt: profile.lastLoginAt,
      createdAt: profile.createdAt,
      daysUsed: profile.daysUsed,
      _tags: [profile.type],
      _geoloc: {
        lat: cache.cities[profile.place].location.latitude,
        lng: cache.cities[profile.place].location.longitude
      }
    })

    console.log(`Saved profile ${profile.username}`)
  }
}

try {
  indexProfiles()
} catch (e) {
  console.log(e)
}
