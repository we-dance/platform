<template>
  <TShareProfile
    :type="profile.type"
    :username="profile.username"
    :description="profile.bio"
    :photo="profile.photo"
    :styles="profile.styles"
  />
</template>

<script>
export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
    const collection = await app.$fire.firestore
      .collection('profiles')
      .where('username', '==', params.id)
      .get()

    if (!collection.docs.length) {
      error({ statusCode: 404 })
    }

    const doc = collection.docs[0]

    const profile = doc.data()
    profile.id = doc.id

    return {
      profile
    }
  }
}
</script>
