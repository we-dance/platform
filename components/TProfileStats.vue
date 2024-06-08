<template>
  <div class="flex flex-wrap text-xs text-gray-500 space-x-1">
    <template v-if="profile.type">
      <TProfileType :type="profile.type" />
      <div>·</div>
    </template>
    <template v-if="profile.venueType">
      <TVenueType :type="profile.venueType" />
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
    <TReviewCount :profile="profile" />
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
    subscribersCount() {
      return (
        this.profile?.subscribersCount ||
        this.profile?.watch?.usernames?.length ||
        0
      )
    },
  },
}
</script>
