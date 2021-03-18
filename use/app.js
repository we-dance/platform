import firebase from 'firebase/app'
import 'firebase/firestore'
import { createGlobalState } from '@vueuse/core'
import { useFirestore } from '@vueuse/firebase'

const db = firebase.initializeApp(process.env.firebase.config).firestore()

export async function cache(name, keyField, check, fields) {
  const collection = await db.collection(name).get()

  const items = {}

  for (const doc of collection.docs) {
    const item = doc.data()
    item.id = doc.id
    const keyValue = item[keyField]

    if (check && !check(item)) {
      continue
    }

    if (!fields) {
      items[keyValue] = item
      continue
    }

    for (const field of fields) {
      if (item[field]) {
        items[keyValue] = items[keyValue] || {}
        items[keyValue][field] = item[field]
      }
    }
  }

  return items
}

export async function warmup() {
  const profiles = await cache('profiles', 'id', (d) => d.username, [
    'username',
    'photo',
    'height',
    'weight',
    'bio',
    'community',
    'locales'
  ])
  const cities = await cache('cities', 'name')

  await db
    .collection('app')
    .doc('latest')
    .set({
      profiles,
      cities
    })
}

export const useCache = createGlobalState(() =>
  useFirestore(db.collection('app').doc('latest'))
)

export const useApp = () => {
  const cache = useCache()

  const read = (collection, id, field) => {
    if (
      !cache.value ||
      !collection ||
      !id ||
      !cache.value[collection] ||
      !cache.value[collection][id]
    ) {
      return ''
    }

    if (!field) {
      return cache.value[collection][id]
    }

    return cache.value[collection][id][field]
  }

  return { read, cache }
}
