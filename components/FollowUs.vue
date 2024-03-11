<template>
  <div>
    <h3 class="text-2xl font-extrabold text-center">
      {{ title }}
    </h3>
    <p class="text-center">
      {{ description }}
    </p>
    <TContactsGrid :profile="profile" hide-website class="mt-4" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    profile: {
      type: Object,
      default: () => ({
        youtube: 'https://www.youtube.com/channel/UC1pdWS3nCLrd8LnQyNNSNUw',
        instagram: 'https://instagram.com/WeDancePlatform',
        telegram: 'https://t.me/WeDancePlatform',
        twitter: 'https://twitter.com/WeDancePlatform',
        facebook: 'https://www.facebook.com/WeDance-109777921433083',
        spotify:
          'https://open.spotify.com/show/7pSbE0qiPpnJ1v0GmnSSkn?si=351061249dd14cb3',
        threads: 'https://threads.net/@WeDancePlatform',
      }),
    },
  },
}
</script>
