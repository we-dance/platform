<template>
  <div>
    <div class="px-4">
      <h4 class="font-bold text-xl">Upcoming Events</h4>
    </div>
    <div
      v-if="response.facets"
      class="mb-4 gap-2 flex flex-wrap p-4 items-center"
    >
      <t-rich-select
        v-model="filters['style']"
        placeholder="Style"
        :options="facets['style']"
        clearable
        hide-search-box
      />

      <t-rich-select
        v-model="filters['type']"
        placeholder="Format"
        :options="facets['type']"
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
        :to="`/events/${item.id}`"
        class="hover:opacity-75"
      >
        <TSharePreviewPost
          :title="item.name"
          :description="getDateTime(item.startDate)"
          :type="item.type"
          collection="events"
          :username="item.organiser"
          :extra="item.venue"
          :styles="item.styles"
          :photo="item.cover"
          size="sm"
        />
      </NuxtLink>
    </div>

    <t-pagination
      v-if="response.nbPages > 1 && !$route.query.search"
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="my-4"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import { getExcerpt, getDateTime } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useApp } from '~/use/app'

export default {
  name: 'TCalendar',
  setup() {
    const radius = ref(10)
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()
    const { city, currentCity, cityName } = useCities()
    const { getCity } = useApp()
    if (!currentCity.value) {
      return
    }
    const { search, response } = useAlgolia('events')
    const facets = computed(() => ({
      type: getFacetOptions('type'),
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
    watch([currentPage, facetFilters, radius, city], () => {
      if (!city.value?.location) {
        return
      }
      search('', {
        filters: '',
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
        case 'style':
          return getStyleName(value)
        default:
          return value
      }
    }
    return {
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
      getDateTime,
    }
  },
}
</script>
