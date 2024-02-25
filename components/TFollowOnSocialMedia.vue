<template>
  <div class="bg-gray-100 flex justify-center">
    <div class="max-w-md py-4 space-y-1">
      <div class="flex justify-center"></div>
      <h3 class="text-2xl font-extrabold text-center">
        {{ $t('profile.follow.title') }}
      </h3>
      <p class="text-center">
        {{ $t('profile.follow.description') }}
      </p>
      <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
        <TButton
          v-if="profile.youtube"
          allow-guests
          icon="youtube"
          type="round"
          icon-size="6"
          :href="profile.youtube"
        />
        <TButton
          v-if="profile.instagram"
          allow-guests
          icon="instagram"
          type="round"
          icon-size="6"
          :href="profile.instagram"
        />
        <TButton
          v-if="profile.telegram"
          allow-guests
          icon="telegram"
          type="round"
          icon-size="6"
          :href="profile.telegram"
        />
        <TButton
          v-if="profile.twitter"
          allow-guests
          icon="twitter"
          type="round"
          icon-size="6"
          :href="profile.twitter"
        />
        <TButton
          v-if="profile.tiktok"
          allow-guests
          icon="tiktok"
          type="round"
          icon-size="6"
          :href="profile.tiktok"
        />
        <TButton
          v-if="profile.facebook"
          allow-guests
          icon="facebook"
          type="round"
          icon-size="6"
          :href="profile.facebook"
        />
      </div>
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
}
</script>
