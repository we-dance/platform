<template>
  <div>
    <TCityHeader :profile="profile" view="classes" global />

    <TCalendar
      :key="'classes' + ($route.query.style || '')"
      :city="profile"
      view="classes"
      class="w-full border-t"
    />
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { trackView } from '~/use/tracking'

export default {
  name: 'ExploreClasses',
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
