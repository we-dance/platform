<template>
  <TOffer class="border rounded space-y-2" :offer="offer" />
</template>

<script>
export default {
  async asyncData({ app, params, error }) {
    const docRef = app.$fire.firestore.collection('offers').doc(params.id)

    const snapshot = await docRef.get()
    const doc = snapshot.data()

    if (!doc) {
      error({ statusCode: 404 })
    }

    return {
      offerId: params.id,
      exists: true,
      loading: false,
      offer: doc
    }
  },
  data: () => ({
    loading: true
  })
}
</script>
