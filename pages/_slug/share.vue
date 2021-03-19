<template>
  <TSharePreview
    :type="profile.type"
    collection="profiles"
    :username="profile.username"
    :description="profile.bio"
    :photo="profile.photo"
    :styles="profile.styles"
    :objective="profile.partner === 'Yes' ? 'Looking for a dance partner' : ''"
  />
</template>

<script>
export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
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

    return {
      profile
    }
  }
}
</script>
