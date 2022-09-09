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
      .update({ viewsCount: viewsCount + 1 })

    ls.set(key, true)
  }
}
