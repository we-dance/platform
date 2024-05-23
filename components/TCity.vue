<template>
  <div>
    <TCityHeader :profile="profile" :view="view" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{
          $t(`explore.${view}.header`, {
            city: shortName,
            style: $route.query.style,
          })
        }}
      </h1>

      <div class="text-sm">
        {{
          $t(`explore.${view}.subheader`, {
            city: shortName,
            style: $route.query.style || 'dance',
          })
        }}
      </div>
      <div class="flex gap-2 justify-between items-center py-2">
        <TProfileStats :profile="profile" />
        <TReaction
          :label="$t('Subscribe')"
          :toggled-label="$t('Subscribed')"
          toggled-class="bg-green-500"
          field="watch"
          type="primary"
          hide-count
          :item="profile"
          collection="profiles"
        />
      </div>
    </div>

    <div v-if="isAdmin()" class="flex gap-2 p-4 bg-orange-100 items-center">
      <TDropdown>
        <TPopupEdit
          v-if="isAdmin()"
          type="context"
          :fields="profileFields"
          :label="$t('Edit')"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
        <TButton
          v-if="isAdmin()"
          type="context"
          icon="delete"
          :label="$t('Delete')"
          @click="remove(profile.id)"
        />
      </TDropdown>
    </div>

    <Lottery />

    <TCalendar :city="profile" :view="view" class="w-full border-t" />

    <WTeaser
      :title="$t('teaser.feed.title')"
      :description="$t('teaser.feed.description')"
      :button="$t('teaser.feed.btn')"
      :url="localePath(`/explore/${profile.username}/tips`)"
      class="w-full"
      background="bg-orange-100"
    />

    <WTeaser
      title="Ambassadors Wanted"
      :description="
        `We are looking for ambassadors in ${profile.name}. Get in touch!`
      "
      button="Get Involved"
      :url="localePath(`/get-involved`)"
      class="w-full"
      background="bg-red-100"
    />

    <FollowUs
      :profile="profile"
      :title="$t('profile.follow.title')"
      :description="$t('profile.follow.description')"
      class="p-4"
    />

    <TSeoLinks :profile="profile" class="p-4" />

    <RandomMemes />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useProfiles } from '~/use/profiles'
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
    const city = cityName
    const view = this.view

    const title = this.$t(`explore.${view}.title`, { city, style })
    const description = this.$t(`explore.${view}.description`, {
      city,
      style,
      referenceStyle: style || 'Salsa',
    })
    const keywords = this.$t(`explore.${view}.keywords`, { city, style })

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

    const breadcrumbs = [
      { name: 'Home', url: 'https://wedance.vip/' },
      { name: city, url: `https://wedance.vip/explore/${profile.username}` },
    ]

    if (view === 'classes') {
      breadcrumbs.push({
        name: 'Classes',
        url: `https://wedance.vip/explore/${profile.username}/classes`,
      })
    }

    if (view === 'groups') {
      breadcrumbs.push({
        name: 'Members',
        url: `https://wedance.vip/explore/${profile.username}/groups`,
      })
    }

    if (view === 'tips') {
      breadcrumbs.push({
        name: 'Ask Locals',
        url: `https://wedance.vip/explore/${profile.username}/tips`,
      })
    }

    if (style) {
      breadcrumbs.push({
        name: style,
        url: 'https://wedance.vip' + this.$route.fullPath,
      })
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
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
        {
          hid: 'breadcrumbs',
          type: 'application/ld+json',
          json: breadcrumbSchema,
        },
      ],
    }
  },
  setup(props) {
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { remove, softUpdate } = useDoc('profiles')

    const shortName = computed(() => props.profile?.name?.split(',')[0])

    return {
      getDateObect,
      getExcerpt,
      uid,
      isAdmin,
      shortName,
      can,
      profileFields,
      remove,
      softUpdate,
    }
  },
}
</script>
