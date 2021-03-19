<template>
  <div class="flex space-x-2 -mx-4 items-center justify-end p-2 bg-gray-100">
    <TButton
      v-if="profile.website"
      :href="profile.website"
      icon="house"
      type="round"
      icon-size="6"
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
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
