<template>
  <TSharePreview
    :type="profile.type"
    collection="profiles"
    :username="profile.username"
    :description="getExcerpt(profile.bio)"
    :photo="profile.photo"
    :styles="profile.styles"
    :price="profile.locality"
  />
</template>

<script>
import { getExcerpt } from '~/utils'
import { useApp } from '~/use/app'

export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
    const { getCity } = useApp()

    const collection = await app.$fire.firestore
      .collection('profiles')
      .where('username', '==', params.slug)
      .get()

    if (!collection.docs.length) {
      error({ statusCode: 404 })
    }

    const doc = collection.docs[0]

    const profile = doc.data()
    profile.type = profile.type || 'Dancer'
    profile.id = doc.id
    profile.locality = getCity(profile.place)

    return {
      profile,
      getExcerpt,
    }
  },
}
</script>
