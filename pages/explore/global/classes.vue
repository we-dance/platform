<template>
  <div>
    <TCityHeader :profile="profile" view="classes" global />

    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{
          $t(`explore.onlineclass.header`, {
            style: $route.query.style,
          })
        }}
      </h1>

      <div class="text-sm">
        {{
          $t(`explore.onlineclass.subheader`, {
            style: $route.query.style,
          })
        }}
      </div>
    </div>

    <TCalendar
      :key="$route.fullPath"
      :city="profile"
      view="online"
      class="w-full border-t"
    />
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { trackView } from '~/use/tracking'

export default {
  name: 'ExploreClasses',
  async asyncData({ params, error }) {
    const city = 'Travel'

    let profile = null
    let profileFound = false

    const collection = await db
      .collection('profiles')
      .where('username', '==', city)
      .get()

    if (collection.docs.length > 0) {
      const doc = collection.docs[0]

      profile = doc.data()
      profile.id = doc.id

      trackView('profiles', profile.id, profile.viewsCount || 0)

      profileFound = true
    }

    if (!profileFound) {
      error({ statusCode: 404 })
    }

    return {
      profile,
    }
  },
  head() {
    const profile = this.profile
    const style = this.$route.query.style || ''

    const title = this.$t(`explore.onlineclass.title`, { style })
    const description = this.$t(`explore.onlineclass.description`, { style })
    const keywords = this.$t(`explore.onlineclass.keywords`, { style })

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `https://wedance.vip/explore/global/classes`,
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
