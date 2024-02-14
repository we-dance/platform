<template>
  <div>
    <TCityHeader :profile="profile" :view="view" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ $route.query.style }}
        {{ view === 'parties' ? 'Parties' : 'Classes' }} in {{ profile.name }}
      </h1>

      <div class="text-sm">
        Discover the vibrant {{ $route.query.style }} dance scene in
        {{ profile.name }}. Browse through a curated list of dance
        {{ view === 'parties' ? 'parties' : 'classes' }} and filter by your
        favorite styles like Salsa, Bachata, Kizomba, and more.
      </div>
      <TProfileStats :profile="profile" />
    </div>

    <TCalendar
      :key="view + ($route.query.style || '')"
      :profile="profile"
      :view="view"
      class="w-full border-t"
    />

    <WTeaser
      :allow-guests="false"
      :title="$t('teaser.feed.title')"
      :description="$t('teaser.feed.description')"
      :button="$t('teaser.feed.btn')"
      :url="`/explore/${profile.username}/tips`"
      class="w-full mt-4"
    />

    <TFollowOnSocialMedia
      v-if="profile.instagram"
      :profile="profile"
      class="py-4"
    />
    <TSeoLinks :profile="profile" class="p-4" />
  </div>
</template>

<script>
import { getExcerpt, getDateObect } from '~/utils'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
    view: {
      type: String,
      default: 'parties',
    },
  },
  head() {
    const profile = this.profile
    const style = this.$route.query.style || ''
    const cityName = profile.name.replace(',', '')
    const view = this.view

    const title = `Dance ${style}${
      view === 'parties' ? ' Parties' : ' Classes'
    } in ${cityName} | Dance Calendar | WeDance`
    const description = `Explore a variety of ${style} dance events happening in ${cityName}. From ${style ||
      'salsa'} nights to bachata workshops, find your next dance adventure here.`
    const keywords = `Where can I dance ${style} in ${cityName}, ${cityName} ${style} Dance Events, ${style} Dance Classes in ${cityName}, ${cityName} ${style} Dance Workshops, ${cityName} ${style} Dance Parties, ${cityName} ${style} Dance Calendar, ${style} Dance Studios ${cityName}, ${style} ${cityName} Dance Community, Popular ${style} Dance Styles ${cityName}`

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `https://wedance.vip/explore/${profile.username}`,
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
  setup() {
    return {
      getDateObect,
      getExcerpt,
    }
  },
}
</script>
