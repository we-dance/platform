import firebase from 'firebase/app'
import 'firebase/firestore'
import useDoc from '~/use/doc'

export async function cache(name, keyField, check, fields) {
  const firestore = firebase.firestore()

  const collection = await firestore.collection(name).get()

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
  const firestore = firebase.firestore()

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

  await firestore
    .collection('app')
    .doc('latest')
    .set({
      profiles,
      cities
    })
}

export default () => {
  const { doc, load, loading } = useDoc('app')

  load('latest')

  const read = (collection, id, field) => {
    if (
      !doc.value ||
      !collection ||
      !id ||
      !doc.value[collection] ||
      !doc.value[collection][id]
    ) {
      return ''
    }

    if (!field) {
      return doc.value[collection][id]
    }

    return doc.value[collection][id][field]
  }

  return {
    read,
    loading,
    cache: doc
  }
}
