<template>
  <div>
    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ $t('explore.global.header', { style: $route.query.style }) }}
      </h1>
      <div class="text-sm">
        {{ $t('explore.global.subheader', { style: $route.query.style }) }}
      </div>
      <TProfileStats :profile="profile" />
    </div>

    <HotDeals />

    <TCalendar :city="profile" view="festivals" class="mt-4 w-full pb-8" />

    <FollowUs
      :profile="profile"
      :title="$t('profile.follow.title')"
      :description="$t('profile.follow.description')"
      class="p-4"
    />

    <RandomMemes />
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
  head() {
    const profile = this.profile
    const style = this.$route.query.style || ''

    const title = this.$t(`explore.global.title`, { style })
    const description = this.$t(`explore.global.description`, { style })
    const keywords = this.$t(`explore.global.keywords`, { style })

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `https://wedance.vip/explore/global`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'WeDance',
        url: 'https://wedance.vip',
      },
    }

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: keywords,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: profile.photo,
        },
      ],
      script: [
        {
          hid: 'schema',
          type: 'application/ld+json',
          json: schema,
        },
      ],
    }
  },
}
</script>
