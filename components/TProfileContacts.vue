<template>
  <div class="md:flex items-center justify-end space-x-2 space-y-2 bg-gray-100">
    <div class="pl-2 font-bold">{{ title }}</div>
    <div class="flex space-x-2 items-center justify-end">
      <TButton
        v-if="profile.website"
        :href="profile.website"
        icon="house"
        type="round"
        icon-size="6"
      />
      <TButton
        v-if="profile.whatsapp"
        icon="whatsapp"
        type="round"
        icon-size="6"
        :href="`https://chat.whatsapp.com/${profile.whatsapp}`"
      />
      <TButton
        v-if="profile.telegram"
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
        v-if="profile.tiktok"
        icon="tiktok"
        type="round"
        icon-size="6"
        :href="`https://tiktok.com/${profile.tiktok}`"
      />
      <TButton
        v-if="profile.youtube"
        icon="youtube"
        type="round"
        icon-size="6"
        :href="`https://youtube.com/${profile.youtube}`"
      />
      <TButton
        v-if="profile.twitter"
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
      default: 'Subscribe',
    },
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
