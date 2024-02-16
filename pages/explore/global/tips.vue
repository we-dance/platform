<template>
  <div>
    <TCityHeader :profile="profile" view="tips" global />

    <TCityTips no-place :city="profile" name="Global" />
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { trackView } from '~/use/tracking'

export default {
  name: 'ExploreTips',
  async asyncData({ params, error }) {
    const city = 'Travel'

    let profile = null
    let profileFound = false

    const collection = await db
      .collection('profiles')
      .where('username', '==', city)
      .get()

    if (collection.docs.length > 0) {
      const doc = collection.docs[0]

      profile = doc.data()
      profile.id = doc.id

      trackView('profiles', profile.id, profile.viewsCount || 0)

      profileFound = true
    }

    if (!profileFound) {
      error({ statusCode: 404 })
    }

    return {
      profile,
    }
  },
}
</script>
