import firebase from 'firebase/app'
import 'firebase/firestore'
import ls from 'local-storage'

export const trackView = (collection, id, viewsCount) => {
  if (!collection || !id) {
    return
  }

  const firestore = firebase.firestore()
  const key = `viewed_${collection}_${id}`
  const alreadyViewed = ls.get(key)

  if (!alreadyViewed) {
    firestore
      .collection(collection)
      .doc(id)
      .update({ views: viewsCount + 1 })

    ls.set(key, true)
  }
}

export const trackNodeView = (id, viewsCount) => {
  const collection = 'posts'

  if (!id) {
    return
  }

  const firestore = firebase.firestore()
  const views = ls.get(collection) || {}
  const alreadyViewed = views[id] || 0

  views[id] = 1

  ls.set(collection, views)

  if (!alreadyViewed) {
    firestore
      .collection(collection)
      .doc(id)
      .update({ viewsCount: viewsCount + 1 })
  }
}
