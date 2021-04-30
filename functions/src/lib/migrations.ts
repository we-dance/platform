import { firestore as db } from '../firebase'

export async function getDocs(collection: FirebaseFirestore.Query) {
  return (await collection.get()).docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id
      } as any)
  )
}

export async function migrateFavs() {
  const posts = await getDocs(db.collection('posts'))

  for (const post of posts) {
    const savedBy = post.savedBy || {}

    const before = Object.keys(savedBy).length

    const responses = await getDocs(
      db.collection('participants').where('eventId', '==', post.id)
    )

    for (const r of responses) {
      if (r.collection === 'posts' && r.rsvp === 'up') {
        savedBy[r.uid] = true
      }
    }

    delete savedBy['null']

    const after = Object.keys(savedBy).length

    await db
      .collection('posts')
      .doc(post.id)
      .update({ savedBy })

    console.log({ title: post.title, before, after })
  }
}
