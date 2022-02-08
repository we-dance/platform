<template>
  <div class="items-center justify-center space-x-2 space-y-2 md:flex">
    <div v-if="title" class="pl-2 font-bold">{{ title }}</div>
    <div class="flex flex-wrap items-center justify-center gap-2 p-4">
      <TButton
        v-if="!short && profile.website"
        :href="profile.website"
        icon="house"
        type="round"
        icon-size="6"
      />
      <TButton
        v-if="!short && profile.whatsapp"
        icon="whatsapp"
        type="round"
        icon-size="6"
        :href="`https://chat.whatsapp.com/${profile.whatsapp}`"
      />
      <TButton
        v-if="!short && profile.telegram"
        icon="telegram"
        type="round"
        icon-size="6"
        :href="`https://t.me/${profile.telegram}`"
      />
      <TButton
        v-if="profile.instagram"
        icon="instagram"
        type="round"
        icon-size="6"
        :href="`https://instagram.com/${profile.instagram}`"
      />
      <TButton
        v-if="!short && profile.tiktok"
        icon="tiktok"
        type="round"
        icon-size="6"
        :href="`https://tiktok.com/${profile.tiktok}`"
      />
      <TButton
        v-if="!short && profile.youtube"
        icon="youtube"
        type="round"
        icon-size="6"
        :href="`https://youtube.com/${profile.youtube}`"
      />
      <TButton
        v-if="!short && profile.twitter"
        icon="twitter"
        type="round"
        icon-size="6"
        :href="`https://twitter.com/${profile.twitter}`"
      />
      <TButton
        v-if="profile.facebook"
        icon="facebook"
        type="round"
        icon-size="6"
        :href="`https://fb.com/${profile.facebook}`"
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
