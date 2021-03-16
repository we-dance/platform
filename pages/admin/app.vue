<template>
  <main>
    App
  </main>
</template>

<script>
async function cache(firestore, name, keyField, check, fields) {
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

async function init(firestore) {
  const profiles = await cache(firestore, 'profiles', 'id', (d) => d.username, [
    'username',
    'photo'
  ])
  const cities = await cache(firestore, 'cities', 'name')

  await firestore
    .collection('app')
    .doc('latest')
    .set({
      profiles,
      cities
    })
}

export default {
  name: 'PageAdminApp',
  async asyncData({ app }) {
    await init(app.$fire.firestore)
  }
}
</script>
