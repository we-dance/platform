<template>
  <div>
    <div class="flex flex-row items-center justify-left gap-2">
      <div>
        {{ $tc('reviews.count', reviews.length, { count: reviews.length }) }}
      </div>
    </div>
    <div>
      <TReview v-for="(review, index) in reviews" :key="index" :item="review" />
    </div>
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
