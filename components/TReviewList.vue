<template>
  <div>
    <div v-if="!reviews.length" class="p-4 text-center text-xs text-gray-700">
      No reviews
    </div>
    <TReview v-for="(review, index) in reviews" :key="index" :item="review" />
  </div>
</template>

<script>
export default {
  props: {
    reviews: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
