<template>
  <router-link
    v-if="reviewsCount"
    :to="`/${profile.username}?view=reviews`"
    class="flex"
  >
    <TIcon class="h-4 w-4" name="star" />
    <span>{{ reviewsAvg }} ({{ reviewsCount }})</span>
  </router-link>
  <span v-else />
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    reviews() {
      return this.profile.reviews || []
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
    reviewsCount() {
      return this.reviews.length || 0
    },
  },
}
</script>
