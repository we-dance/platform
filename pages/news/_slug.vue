<template>
  <div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        {{ page.title }}
      </h1>
      <div class="text-center text-lg text-gray-700">
        {{ page.description }}
      </div>
    </div>

    <div class="p-4">
      <div class="rounded shadow">
        <img :src="page.image" />
      </div>

      <nuxt-content :document="page" class="typo" />
    </div>

    <div class="px-4 my-4 grid grid-cols-1 gap-4">
      <LandingFeature
        title="News & Updates"
        description="Latest updates, release notes, and outage reports. Stay informed and be the first to know about new features and important announcements."
        button="Follow on Telegram"
        href="https://t.me/WeDancePlatform"
        bottom="We also post on other platforms, but Telegram is our primary channel."
      />

      <div class="flex justify-center">
        <TContactsGrid
          :profile="{
            instagram: 'https://instagram.com/WeDancePlatform',
            twitter: 'https://x.com/WeDancePlatform',
            threads: 'https://threads.net/@WeDancePlatform',
          }"
        />
      </div>
    </div>

    <HubspotChat />
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const slug = params.slug
    const page = await $content(`news/${slug}`).fetch()

    return {
      page,
    }
  },
}
</script>
