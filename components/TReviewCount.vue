<template>
  <router-link
    v-if="profile.username && reviewsCount"
    :to="`/${profile.username}?view=reviews`"
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
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    reviews: [],
  }),
  computed: {
    reviewsCount() {
      return this.profile.reviewsCount || this.reviews.length || 0
    },
    reviewsAvg() {
      if (this.profile?.reviewsAvg) {
        return this.profile.reviewsAvg
      }

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
    'profile.username'() {
      this.load()
    },
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (!this.profile?.username) {
        return
      }

      const firestore = firebase.firestore()

      let newReviews = []

      if (this.username) {
        const reviewsRef = await firestore
          .collection('stories')
          .where('receiver.username', '==', this.profile.username)
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
