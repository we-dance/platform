<template>
  <div class="md:flex items-center justify-center space-x-2 space-y-2">
    <div v-if="title" class="pl-2 font-bold">{{ title }}</div>
    <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
      <TButton
        v-if="!short && profile.website"
        :href="profile.website"
        icon="house"
        type="round"
        icon-size="6"
      />
      <TButton
        v-if="!short && profile.couchsurfing"
        icon="couchsurfing"
        type="round"
        icon-size="6"
        :href="profile.couchsurfing"
      />
      <TButton
        v-if="!short && profile.airbnb"
        icon="airbnb"
        type="round"
        icon-size="6"
        :href="profile.airbnb"
      />
      <TButton
        v-if="!short && profile.blablacar"
        icon="blablacar"
        type="round"
        icon-size="6"
        :href="profile.blablacar"
      />
      <TButton
        v-if="!short && profile.whatsapp"
        icon="whatsapp"
        type="round"
        icon-size="6"
        :href="profile.whatsapp"
      />
      <TButton
        v-if="!short && profile.telegram"
        icon="telegram"
        type="round"
        icon-size="6"
        :href="profile.telegram"
      />
      <TButton
        v-if="profile.instagram"
        icon="instagram"
        type="round"
        icon-size="6"
        :href="profile.instagram"
      />
      <TButton
        v-if="!short && profile.tiktok"
        icon="tiktok"
        type="round"
        icon-size="6"
        :href="profile.tiktok"
      />
      <TButton
        v-if="!short && profile.youtube"
        icon="youtube"
        type="round"
        icon-size="6"
        :href="profile.youtube"
      />
      <TButton
        v-if="!short && profile.twitter"
        icon="twitter"
        type="round"
        icon-size="6"
        :href="profile.twitter"
      />
      <TButton
        v-if="profile.facebook"
        icon="facebook"
        type="round"
        icon-size="6"
        :href="profile.facebook"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    profile: {
      type: Object,
      default: () => ({}),
    },
    short: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
