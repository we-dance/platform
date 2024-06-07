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
    <TReviewCount :username="profile.username" />
    <div>·</div>
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
    subscribersCount() {
      return this.profile?.watch?.usernames?.length || 0
    },
  },
}
</script>
