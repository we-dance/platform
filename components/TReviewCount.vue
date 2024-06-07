<template>
  <router-link
    v-if="reviewsCount"
    :to="`/${username}?view=reviews`"
    class="flex"
  >
    <TIcon class="h-4 w-4" name="star" />
    <span>{{ reviewsAvg }} ({{ reviewsCount }})</span>
  </router-link>
  <span v-else />
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { sortBy } from '~/utils'

export default {
  props: {
    username: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    reviews: [],
  }),
  computed: {
    reviewsCount() {
      return this.reviews.length || 0
    },
    reviewsAvg() {
      if (!this.reviewsCount) {
        return 0
      }

      return (
        this.reviews
          .map((r) => Number(r.stars) || 5)
          .reduce((p, c) => p + c, 0) / this.reviewsCount
      )
    },
  },
  watch: {
    username() {
      this.load()
    },
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (!this.username) {
        return
      }

      const firestore = firebase.firestore()

      let newReviews = []

      if (this.username) {
        const reviewsRef = await firestore
          .collection('stories')
          .where('receiver.username', '==', this.username)
          .get()

        newReviews = reviewsRef.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      }

      this.reviews = newReviews.sort(sortBy('-createdAt'))
    },
  },
}
</script>
