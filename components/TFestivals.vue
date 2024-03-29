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

    <div v-if="profile.instagram" class="bg-gray-100 py-4 flex justify-center">
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
