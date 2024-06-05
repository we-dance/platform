<template>
  <div>
    <TCity :key="$route.fullPath" :profile="profile" view="parties" />
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { trackView } from '~/use/tracking'

export default {
  name: 'ExploreParties',
  async asyncData({ params, error, redirect }) {
    const city = params.city

    if (city === 'Travel') {
      redirect('/explore/global')
      return
    }

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
