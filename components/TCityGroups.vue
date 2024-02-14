<template>
  <div>
    <TCityHeader :profile="city" view="groups" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">Groups in {{ city.name }}</h1>
      <div class="text-sm">
        Discover and connect with dance influencers and groups in
        {{ city.name }}. Find WhatsApp, Telegram, Instagram, Youtube communities
        tailored to your style, from Salsa to Bachata to Kizomba. Engage with
        influencers and join vibrant dance networks in {{ city.name }}.
      </div>
      <div>
        <ul class="list-disc pl-4 pt-4">
          <li>
            Looking for partner?
            <router-link to="/find-partner/start" class="underline font-bold"
              >Find a dance partner</router-link
            >
          </li>
          <li>
            Want to help community?
            <router-link
              :to="`/reviews/add?city=${city.cityPlaceId}`"
              class="underline font-bold"
              >Recommend someone</router-link
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-b">
      <div class="space-y-2 p-4">
        <div v-if="response.facets" class="gap-2 flex flex-wrap items-center">
          <t-rich-select
            v-model="groupType"
            placeholder="Platform"
            :options="groupTypes"
            clearable
            hide-search-box
          />

          <t-rich-select
            v-model="filters['type']"
            placeholder="Role"
            :options="facets['type']"
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
        />
      </div>
      <div v-else>
        <div class="text-xs text-center p-4">
          There are no members yet.
        </div>
      </div>

      <div v-if="response.nbPages > 1" class="my-4 flex justify-center">
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
  name: 'Community',
  props: {
    city: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
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
    const radius = ref(10)
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
      filters.value = {}
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
      if (uid.value) {
        return `visibility:Public OR visibility:Members`
      } else {
        return 'visibility:Public'
      }
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
        hitsPerPage: uid.value ? 10 : 4,
      })
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
    return {
      title: 'WeDance Community',
    }
  },
}
</script>
