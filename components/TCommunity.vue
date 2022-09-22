<template>
  <div>
    <div class="px-4">
      <h4 class="font-bold text-xl">Meet {{ cityName }} Dance Community</h4>
      <p class="text-xs">
        Looking for dance partner or new dance events? Filter profiles of local
        dancers and contact them.
      </p>
    </div>
    <div
      v-if="response.facets"
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

      <t-rich-select
        v-if="filters['style']"
        v-model="filters['objectives']"
        :placeholder="$t(`profile.objectives`)"
        :options="facets['objectives']"
        clearable
        hide-search-box
      />

      <TButton v-if="facetFilters" allow-guests type="link" @click="load()">
        {{ $t('filter.reset') }}
      </TButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <NuxtLink
        v-for="item in response.hits"
        :key="item.id"
        :to="`/${item.username}`"
        class="hover:opacity-75"
      >
        <TSharePreviewPost
          :type="item.type"
          collection="profiles"
          :username="item.username"
          :extra="getCity(item.place)"
          :photo="item.photo"
          :styles="item.styles"
          size="sm"
        />
      </NuxtLink>
    </div>

    <t-pagination
      v-if="uid && response.nbPages > 1 && !$route.query.search"
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="my-4"
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
    const { search, response } = useAlgolia('profiles')
    const facets = computed(() => ({
      type: getFacetOptions('type').filter(
        (o) => !['FanPage', 'City'].includes(o.value)
      ),
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
        filters: filterQuery.value,
        facets: Object.keys(facets.value),
        facetFilters: facetFilters.value,
        page: currentPage.value - 1,
        aroundLatLng: radius.value
          ? `${city.value.location.latitude}, ${city.value.location.longitude}`
          : '',
        aroundRadius: radius.value * 1000 || 1,
        hitsPerPage: uid.value ? 10 : 4,
      })
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
    }
  },
}
</script>
