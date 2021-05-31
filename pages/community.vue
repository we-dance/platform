<template>
  <div>
    <THeader title="Community" />

    <div>
      <div v-if="uid && response.facets" class="mb-4 gap-2 flex flex-wrap p-4">
        <t-rich-select
          v-model="radius"
          placeholder="Radius"
          :options="radiusOptions"
          hide-search-box
        />

        <t-rich-select
          v-for="(options, field) in facets"
          :key="field"
          v-model="filters[field]"
          :placeholder="$t(`profile.${field}`)"
          :options="options"
          clearable
          hide-search-box
        />

        <TButton v-if="facetFilters" type="base" @click="load()">
          Reset filters
        </TButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <router-link
          v-for="item in response.hits"
          :key="item.id"
          :to="`/${item.username}`"
          class="hover:opacity-75"
        >
          <TSharePreviewPost
            :type="item.type"
            collection="profiles"
            :username="item.username"
            :description="getExcerpt(item.bio)"
            :color="item.partner === 'Yes' ? 'bg-green-400' : 'bg-red-400'"
            :photo="item.photo"
            :styles="item.styles"
            size="sm"
          />
        </router-link>
      </div>

      <t-pagination
        v-if="uid && response.nbPages > 1 && !$route.query.search"
        v-model="currentPage"
        :total-items="response.nbHits"
        :per-page="response.hitsPerPage"
        class="my-4"
      />

      <WTeaser
        v-if="!uid"
        :title="$t('teaser.profile.title')"
        :description="$t('teaser.profile.description')"
        :button="$t('teaser.profile.btn')"
        url="/signup"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import { getExcerpt, getOptions } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { objectivesList, typeList } from '~/use/profiles'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  name: 'ProfilesIndex',
  setup() {
    const radius = ref(50)
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()
    const { city, currentCity } = useCities()

    const { search, response } = useAlgolia('profiles')

    const facets = computed(() => ({
      type: getFacetOptions('type'),
      gender: getFacetOptions('gender'),
      objectives: getFacetOptions('objectives'),
      style: getFacetOptions('style')
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
        hitsPerPage: uid.value ? 10 : 4
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
        })`
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

    const radiusOptions = [
      {
        label: 'around 10km',
        value: 10
      },
      {
        label: 'around 20km',
        value: 20
      },
      {
        label: 'around 50km',
        value: 50
      },
      {
        label: 'around 100km',
        value: 100
      },
      {
        label: 'around 500km',
        value: 500
      },
      {
        label: 'around 1000km',
        value: 1000
      },
      {
        label: 'Anywhere',
        value: ''
      }
    ]

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
      currentCity
    }
  }
}
</script>
