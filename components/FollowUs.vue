<template>
  <div>
    <h3 class="text-2xl font-extrabold text-center">
      {{ title }}
    </h3>
    <p class="text-center">
      {{ description }}
    </p>
    <TContactsGrid
      :profile="socialMedia"
      hide-website
      class="mt-4 justify-center"
    />
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
      default: () => ({}),
    },
  },
  computed: {
    socialMedia() {
      const travel = {
        instagram: 'https://www.instagram.com/wedancetravel/',
        telegram: 'https://www.instagram.com/wedancetravel/',
        threads: 'https://threads.net/@WeDancePlatform',
        youtube: 'https://www.youtube.com/@wedancestory',
        spotify:
          'https://open.spotify.com/show/7pSbE0qiPpnJ1v0GmnSSkn?si=351061249dd14cb3',
        twitter: 'https://twitter.com/WeDancePlatform',
      }

      return { ...travel, ...this.profile }
    },
  },
}
</script>
