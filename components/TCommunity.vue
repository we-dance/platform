<template>
  <div>
    <div class="px-4">
      <h4 class="font-bold text-xl">{{ $t('community.title') }}</h4>
      <p class="text-xs">
        {{ $t('community.description') }}
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

    <div v-if="filters['type']" class="space-y-2 p-4">
      <div v-for="profile in response.hits" :key="`artist-${profile.username}`">
        <WProfile
          v-if="profile"
          :username="profile.username"
          :fallback="profile"
        />
      </div>
    </div>

    <t-pagination
      v-if="
        filters['type'] && uid && response.nbPages > 1 && !$route.query.search
      "
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="my-4"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import { getExcerpt } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useProfiles } from '~/use/profiles'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
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
    const { getCity } = useApp()
    const { objectivesList, typeList, radiusOptions } = useProfiles()
    if (!currentCity.value) {
      return
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
        case 'type':
          return typeList.find((o) => o.value === value)?.label || value
        case 'objectives':
          return objectivesList.find((o) => o.value === value)?.label || value
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
