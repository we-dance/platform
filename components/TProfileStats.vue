<template>
  <div>
    <div class="flex flex-wrap text-xs text-gray-500 space-x-1">
      <template v-if="!hideType && profile.type">
        <TProfileType :type="profile.type" />
        <div>·</div>
      </template>
      <template v-if="profile.venueType">
        <TVenueType :type="profile.venueType" />
        <div>·</div>
      </template>
      <template v-if="!hideViews">
        <div>
          {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
        </div>
        <div>·</div>
      </template>
      <button @click="openSubscribersPopup()">
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
      <div class="max-w-md mx-auto py-4 max-h-screen overflow-y-scroll">
        <div v-if="!profile.watch || profile.watch.usernames.length === 0">
          <div class="text-center text-gray-500">
            {{ $t('No subscribers') }}
          </div>
        </div>
        <template v-else>
          <div v-for="username in profile.watch.usernames" :key="username">
            <WProfile :username="username" hide-buttons class="w-64" />
          </div>
        </template>
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
    hideType: {
      type: Boolean,
      default: false,
    },
    hideViews: {
      type: Boolean,
      default: false,
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
  methods: {
    openSubscribersPopup() {
      this.$track('subscribers_popup')
      this.showSubscribers = true
    },
  },
}
</script>
