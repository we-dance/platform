<template>
  <div>
    <TCityHeader :profile="city" view="groups" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">
        {{ $t('explore.overview.header', { city: city.name }) }}
      </h1>
      <div class="text-sm">
        {{
          $t('explore.overview.subheader', {
            city: city.name,
            style: $route.query.style || 'dance',
          })
        }}
      </div>
      <div class="flex gap-2 justify-between items-center py-2">
        <TProfileStats :profile="city" />
        <TProfileModeration :profile="city" />
        <TReaction
          :label="$t('Subscribe')"
          :toggled-label="$t('Subscribed')"
          toggled-class="bg-green-500"
          field="watch"
          type="primary"
          hide-count
          :item="city"
          collection="profiles"
        />
      </div>
      <TContactsGrid
        :profile="city"
        hide-website
        class="mt-4 justify-center"
        title="Follow us for new events, dance videos, and community updates."
      />
    </div>

    <TExpand v-if="city.story" class="border-t p-4 mb-4">
      <TPreview v-if="city.story" :content="city.story" />
    </TExpand>

    <div class="border-t border-b">
      <div class="space-y-2 p-4">
        <TInputButtons v-model="filters['type']" :options="tabs" />

        <div v-if="response.facets" class="gap-2 flex flex-wrap items-center">
          <t-rich-select
            v-if="false"
            v-model="groupType"
            placeholder="Platform"
            :options="groupTypes"
            clearable
            hide-search-box
          />

          <t-rich-select
            v-model="filters['style']"
            :placeholder="$t(`profile.style`)"
            :options="facets['style']"
            clearable
            hide-search-box
          />
        </div>
      </div>

      <div v-if="response.hits && response.hits.length > 0" class="space-y-2">
        <WProfile
          v-for="item in response.hits"
          :key="item.username"
          :username="item.username"
          :fallback="item"
          hide-role
          show-amenities
        />
      </div>

      <div v-if="!uid || response.nbPages > 1" class="my-4 flex justify-center">
        <TButton label="Load More" type="primary" @click="loadMore" />
      </div>

      <WTeaser
        v-if="!uid"
        :title="$t('teaser.profile.title')"
        :description="$t('teaser.profile.description')"
        :button="$t('teaser.profile.btn')"
        url="/signin"
        class="mt-4"
      />
    </div>

    <WTeaser
      title="Contribute"
      description="Help us grow the dance community by adding your favorite places, artists, and events."
      button="Add Recommendation"
      :url="localePath(`/reviews/add?city=${city.cityPlaceId}`)"
      class="w-full"
      background="bg-green-100"
    />

    <WTeaser
      :title="$t('teaser.feed.title')"
      :description="$t('teaser.feed.description')"
      :button="$t('teaser.feed.btn')"
      :url="localePath(`/explore/${city.username}/tips`)"
      class="w-full"
      background="bg-orange-100"
    />

    <WTeaser
      title="Promote & Earn"
      description="If you're a dancer, influencer, or just love sharing your passion for dance, this is your chance to shine and earn."
      button="Read More"
      :url="localePath('/promoter')"
      class="w-full"
      background="bg-red-100"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import { getExcerpt, getOptions } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useProfiles } from '~/use/profiles'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'
import { useApp } from '~/use/app'

export default {
  name: 'CityGroups',
  props: {
    city: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root }) {
    const tabs = [
      { label: 'Places', value: 'Venue' },
      { label: 'Hosts', value: 'Organiser' },
      { label: 'Artists', value: 'Artist' },
      { label: 'Dancers', value: 'Dancer' },
    ]

    const groupTypes = [
      {
        label: 'Whatsapp',
        value: 'whatsapp',
      },
      {
        label: 'Telegram',
        value: 'telegram',
      },
      {
        label: 'Instagram',
        value: 'instagram',
      },
      {
        label: 'Facebook',
        value: 'facebook',
      },
      {
        label: 'Youtube',
        value: 'youtube',
      },
      {
        label: 'LinkedIn',
        value: 'linkedin',
      },
      {
        label: 'TikTok',
        value: 'tiktok',
      },
      {
        label: 'Couchsurfing',
        value: 'couchsurfing',
      },
      {
        label: 'X (Twitter)',
        value: 'twitter',
      },
    ]
    const radius = ref(root.$route.query.radius || 50)
    const groupType = ref('')
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()
    const { getCity } = useApp()
    const { objectivesList, typeList, radiusOptions } = useProfiles()
    const { search, response, loadMore } = useAlgolia('profiles')
    const facets = computed(() => ({
      type: getFacetOptions('type'),
      gender: getFacetOptions('gender'),
      objectives: getFacetOptions('objectives'),
      style: getFacetOptions('style'),
    }))
    function load() {
      filters.value = {
        type: 'Venue',
      }
      query.value = ''
    }
    onMounted(load)
    const typeOptions = getOptions(typeList, 'All')
    const facetFilters = computed(() => {
      return Object.keys(filters.value)
        .filter((field) => filters.value[field])
        .map((field) => `${field}:${filters.value[field]}`)
        .join(',')
    })
    const filterQuery = computed(() => {
      return ``
    })
    watch([currentPage, facetFilters, radius], () => {
      search('', {
        filters: `${filterQuery.value}`,
        facets: Object.keys(facets.value),
        facetFilters: facetFilters.value,
        page: currentPage.value - 1,
        aroundLatLng: radius.value
          ? `${props.city.location.latitude}, ${props.city.location.longitude}`
          : '',
        aroundRadius: radius.value * 1000 || 1,
        hitsPerPage: uid.value ? 10 : 3,
      })
      if (process.server) return
      window.scrollTo(0, 0)
    })
    const { getStyleName } = useStyles()
    function getFacetOptions(field) {
      if (!response.value?.facets || !response.value.facets[field]) {
        return []
      }
      return Object.keys(response.value.facets[field]).map((val) => ({
        value: val,
        label: `${getFieldLabel(field, val)} (${
          response.value.facets[field][val]
        })`,
      }))
    }
    function getFieldLabel(field, value) {
      if (!value) {
        return ''
      }
      switch (field) {
        case 'objectives':
          return objectivesList.find((o) => o.value === value).label
        case 'style':
          return getStyleName(value)
        default:
          return value
      }
    }
    return {
      tabs,
      groupType,
      groupTypes,
      radiusOptions,
      uid,
      getFacetOptions,
      facets,
      getExcerpt,
      search,
      query,
      response,
      typeOptions,
      filters,
      currentPage,
      profileType,
      facetFilters,
      getFieldLabel,
      radius,
      load,
      getCity,
      loadMore,
    }
  },
  head() {
    const city = this.city.name.replace(',', '')

    const title = this.$t(`explore.overview.title`, { city })
    const description = this.$t(`explore.overview.description`, { city })
    const keywords = this.$t(`explore.overview.keywords`, { city })

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `https://wedance.vip/explore/${this.city.username}`,
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
          content: this.city.photo,
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
