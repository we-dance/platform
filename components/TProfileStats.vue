<template>
  <div class="flex flex-wrap text-xs text-gray-500 space-x-1">
    <template v-if="profile.reviews && profile.reviews.length">
      <TReviewCount :profile="profile" />
      <div>·</div>
    </template>
    <div>
      {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
    </div>
    <div>·</div>
    <div>
      {{
        $tc('subscribers', subscribersCount, {
          count: subscribersCount,
        })
      }}
    </div>
  </div>
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
    reviewsCount() {
      return this.profile.reviewsCount
    },
    subscribersCount() {
      return this.profile?.watch?.usernames?.length || 0
    },
  },
}
</script>
