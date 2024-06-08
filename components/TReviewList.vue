<template>
  <div>
    <div class="flex justify-center my-4 border-b">
      <TButton
        :to="`/reviews/add?receiver=${profile.username}`"
        variant="primary"
        class="mb-4"
        label="Write a review"
      />
    </div>
    <div v-if="!reviews.length" class="p-4 text-center text-xs text-gray-700">
      No reviews
    </div>
    <TPost
      v-for="(review, index) in reviews"
      :key="index"
      :item="review"
      hide-receiver
    />
  </div>
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
    reviews: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      items: [],
    }
  },
  async mounted() {
    if (this.reviews.length) {
      this.items = this.reviews
      return
    }

    const firestore = firebase.firestore()

    let newReviews = []

    if (this.profile.username) {
      const reviewsRef = await firestore
        .collection('stories')
        .where('receiver.username', '==', this.profile.username)
        .get()

      newReviews = reviewsRef.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    }

    this.items = newReviews.sort(sortBy('-createdAt'))
  },
}
</script>
