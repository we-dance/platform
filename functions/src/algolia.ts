// import { firestore } from './firebase'
// import { initIndex, profileToAlgolia } from './lib/algolia'

// async function indexProfiles() {
//   const cache = (
//     await firestore
//       .collection('app')
//       .doc('v2')
//       .get()
//   ).data() as any

//   const index = initIndex('profiles')

//   const profileDocs = (await firestore.collection('profiles').get()).docs
//   const objects = []

//   for (const doc of profileDocs) {
//     const profile = {
//       id: doc.id,
//       ...doc.data()
//     } as any

//     if (!profile.username || !profile.place) {
//       await index.deleteObject(profile.id)
//       continue
//     }

//     objects.push(profileToAlgolia(profile, cache))
//   }

//   await index.saveObjects(objects)
// }

// try {
//   indexProfiles()
// } catch (e) {
//   console.log(e)
// }
