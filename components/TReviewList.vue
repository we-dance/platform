<template>
  <div>
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
