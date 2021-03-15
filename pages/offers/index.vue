<template>
  <main>
    <TTitle>
      Offers
      <template slot="right">
        <TButton to="/offers/-/edit" type="primary">Add Offer</TButton>
      </template>
    </TTitle>

    <div class="space-y-2">
      <TOffer
        v-for="offer in offers"
        :key="offer.id"
        class="border rounded space-y-2"
        :offer="offer"
      />
    </div>
  </main>
</template>

<script>
export default {
  async asyncData({ app }) {
    const docsRef = app.$fire.firestore
      .collection('offers')
      .orderBy('createdAt')

    const collection = await docsRef.get()

    const last = collection.docs[collection.docs.length - 1]

    const offers = collection.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id
      }
    })

    return {
      offers,
      last,
      loading: false
    }
  },
  data: () => ({
    loading: true
  }),
  methods: {
    async loadMore() {
      const docsRef = this.$fire.firestore
        .collection('offers')
        .orderBy('createdAt')
        .startAfter(this.last)

      const collection = await docsRef.get()

      const offers = collection.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id
        }
      })

      this.last = collection.docs[collection.docs.length - 1]

      this.offers.push(...offers)
    }
  }
}
</script>
