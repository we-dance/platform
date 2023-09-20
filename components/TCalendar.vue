<template>
  <div>
    <div
      v-if="response.facets && response.nbHits > 0"
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

      <t-rich-select
        v-model="filters['organizer']"
        placeholder="Organizer"
        :options="facets['organizer']"
        clearable
        hide-search-box
      />

      <t-rich-select
        v-model="filters['venue']"
        placeholder="Venue"
        :options="facets['venue']"
        clearable
        hide-search-box
      />

      <TButton v-if="facetFilters" allow-guests type="link" @click="load()">
        {{ $t('filter.reset') }}
      </TButton>
    </div>

    <div>
      <NuxtLink
        v-for="item in response.hits"
        :key="item.id"
        :to="`/events/${item.id}`"
        class="hover:opacity-75"
      >
        <TEventText4
          :id="item.id"
          :name="item.name"
          :cover="item.cover"
          :venue="item.venue"
          :price="item.price"
          :start-date="getDateObect(item.startDate)"
          :event-type="item.type"
          :styles="item.styles"
          :organiser="item.organizer"
        />
      </NuxtLink>
    </div>

    <div v-if="!response.nbHits" class="p-4 flex justify-center items-center">
      <div>
        There are no events yet. Ask organisers.
      </div>
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
import { getExcerpt, getDateObect } from '~/utils'
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
    const today = Date.now()
    if (!currentCity.value) {
      return
    }
    const { search, response } = useAlgolia('events')
    const facets = computed(() => ({
      type: getFacetOptions('type'),
      style: getFacetOptions('style'),
      venue: getFacetOptions('venue'),
      organizer: getFacetOptions('organizer'),
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
        filters: `startDate>${today}`,
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
      getDateObect,
    }
  },
}
</script>
