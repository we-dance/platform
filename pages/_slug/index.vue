<template>
  <div>
    <template v-if="page">
      <nuxt-content :document="page" :class="classes" />
      <LandingFeature
        v-if="page.cta"
        :title="page.cta.title"
        :description="page.cta.description"
        :button="page.cta.button"
        :url="page.cta.url"
        :button-action="page.cta.action"
      />
    </template>
    <TFestivals v-else-if="profile.username === 'Travel'" :profile="profile" />
    <TCity v-else-if="profile.type === 'City'" :profile="profile" />
    <TProfile v-else :profile="profile" />
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { useDoc } from '~/use/doc'
import { trackView } from '~/use/tracking'

export default {
  name: 'Slug',
  layout: 'full',
  async asyncData({ $content, params, error, redirect }) {
    const slug = params.slug

    if (slug === 'Travel') {
      redirect(`/explore/global`)
    }

    let page = null
    let profile = null
    let pageFound = false
    let profileFound = false

    try {
      page = await $content(slug).fetch()
      pageFound = true
    } catch (e) {}

    if (!pageFound) {
      if (slug.includes('id@')) {
        const id = slug.split('@')[1]
        const collection = await db
          .collection('profiles')
          .doc(id)
          .get()

        if (collection.exists) {
          profile = collection.data()
          profile.id = collection.id

          trackView('profiles', profile.id, profile.viewsCount || 0)

          profileFound = true
        }
      } else {
        const collection = await db
          .collection('profiles')
          .where('username', '==', slug)
          .get()

        if (collection.docs.length > 0) {
          const doc = collection.docs[0]

          profile = doc.data()
          profile.id = doc.id

          trackView('profiles', profile.id, profile.viewsCount || 0)

          profileFound = true

          if (profile.type === 'City') {
            redirect(`/explore/${profile.username}`)
          }
        }
      }
    }

    if (!pageFound && !profileFound) {
      error({ statusCode: 404 })
    }

    return {
      page,
      profile,
    }
  },
  setup() {
    const { doc: item, sync } = useDoc('profiles')

    return {
      item,
      sync,
    }
  },
  computed: {
    classes() {
      let classes = ''

      if (this.page) {
        classes += this.page.container + ' p-4 '
        classes += this.page.notypo ? '' : 'typo'
      }

      return classes
    },
  },
  watch: {
    item() {
      if (this.item) {
        this.profile = this.item
      }
    },
  },
  mounted() {
    if (this.profile) {
      this.sync(this.profile.id)
    }
  },
  head() {
    if (this.profile) {
      const profile = this.profile

      return {
        title: profile.username,
        canonical: `/${profile.username}`,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: profile.bio,
          },
          {
            property: 'og:image',
            content: profile.socialCover || profile.photo,
            hid: 'og:image',
          },
          {
            property: 'og:type',
            content: 'profile',
            hid: 'og:type',
          },
          {
            property: 'og:title',
            content: profile.username,
            hid: 'og:title',
          },
          {
            property: 'og:description',
            content: profile.bio,
            hid: 'og:description',
          },
        ],
      }
    }

    if (this.page) {
      const page = this.page

      return {
        title: page.title,
        canonical: `/${page.slug}`,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: page.description,
          },
          {
            property: 'og:type',
            content: 'article',
            hid: 'og:type',
          },
          {
            property: 'og:title',
            content: page.title,
            hid: 'og:title',
          },
          {
            property: 'og:description',
            content: page.description,
            hid: 'og:description',
          },
        ],
      }
    }
  },
}
</script>
