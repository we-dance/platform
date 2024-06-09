<template>
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

    <div class="grid grid-cols-2 gap-4">
      <NuxtLink
        v-for="page in pages"
        :key="page.slug"
        :to="`/news/${page.slug}`"
        class="rounded shadow"
      >
        <img :src="page.image" />
      </NuxtLink>
    </div>
    <HubspotChat />
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const pages = await $content('news')
      .sortBy('slug', 'desc')
      .fetch()

    return {
      pages,
    }
  },
}
</script>
