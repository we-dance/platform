<template>
  <div>
    <THeader show-logo class="md:hidden" />
    <div class="p-4">
      <h1 class="text-2xl font-bold">Community in {{ cityName }}</h1>
    </div>

    <div>
      <div
        v-if="uid && response.facets"
        class="mb-4 gap-2 flex flex-wrap p-4 items-center"
      >
        <TInputButtons v-model="filters['type']" :options="facets['type']" />

        <t-rich-select
          v-if="filters['type']"
          v-model="filters['style']"
          :placeholder="$t(`profile.style`)"
          :options="facets['style']"
          clearable
          hide-search-box
        />
      </div>

      <div class="space-y-2 p-4">
        <WProfile
          v-for="item in response.hits"
          :key="item.username"
          :username="item.username"
          :fallback="item"
          hide-role
        />
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
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { useApp } from '~/use/app'

export default {
  name: 'Community',
  setup() {
    const radius = ref(10)
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()
    const { city, currentCity, cityName } = useCities()
    const { router } = useRouter()
    const { getCity } = useApp()
    const { objectivesList, typeList, radiusOptions } = useProfiles()
    if (!currentCity.value) {
      router.push('/cities')
    }
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
    watch([currentPage, facetFilters, radius, city], () => {
      if (!city.value?.location) {
        return
      }
      search('', {
        filters: `${filterQuery.value} AND (type:Organiser OR type:Artist OR type:Venue OR type:FanPage)`,
        facets: Object.keys(facets.value),
        facetFilters: facetFilters.value,
        page: currentPage.value - 1,
        aroundLatLng: radius.value
          ? `${city.value.location.latitude}, ${city.value.location.longitude}`
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
      cityName,
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
