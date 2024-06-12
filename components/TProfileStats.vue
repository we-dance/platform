<template>
  <div>
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
      <button @click="showSubscribers = true">
        {{
          $tc('subscribers', subscribersCount, {
            count: subscribersCount,
          })
        }}
      </button>
      <TReviewCount :profile="profile" />
    </div>
    <TPopup
      v-if="showSubscribers"
      :title="`${profile.username} subscribers`"
      @close="showSubscribers = false"
    >
      <div class="py-6 overflow-y-scroll">
        <div v-if="!profile.watch || profile.watch.usernames.length === 0">
          <div class="text-center text-gray-500">
            {{ $t('No subscribers') }}
          </div>
        </div>
        <div v-for="username in profile.watch.usernames" v-else :key="username">
          <WProfile :username="username" hide-buttons class="w-64" />
        </div>
      </div>
    </TPopup>
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
  data: () => ({
    showSubscribers: false,
  }),
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
