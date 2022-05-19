import { firestore as db } from '../firebase'

export async function getDocs(collection: FirebaseFirestore.Query) {
  return (await collection.get()).docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as any)
  )
}

export async function getCities() {
  const profiles = await getDocs(db.collection('profiles'))
  const app = (await db.collection('app').doc('v2').get()).data() as any

  const cities = {} as any

  for (const profile of profiles) {
    if (!profile.place) {
      continue
    }

    if (!app.cities[profile.place]) {
      console.log(
        `Missing place:${profile.place} for username:${profile.username} uid:${profile.id}`
      )
      continue
    }

    const name = app.cities[profile.place].name

    if (!cities[name]) {
      cities[name] = 0
    }

    cities[name]++
  }

  console.log(cities)
}
