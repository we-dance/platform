<template>
  <div>
    <div v-if="$route.query.search" class="flex items-center mb-4">
      <TInput
        v-model="query"
        auto-focus
        placeholder="Search dancers"
        @input="search"
      />
      <TButton type="icon" icon="close" to="/community" />
    </div>

    <div v-if="!$route.query.search || query">
      <portal to="right">
        <TCollapseIcon
          v-if="response.facets"
          title="Filter"
          icon="tune"
          desktop-class="w-56 space-y-2 p-4"
        >
          <div v-if="uid" class="mb-4">
            <router-link
              to="/community/for-you"
              class="underline hover:no-underline text-blue-500"
              >Top picks for you</router-link
            >
          </div>

          <div class="space-y-2">
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

            <TButton v-if="facetFilters" @click="load()">
              Reset filters
            </TButton>
          </div>
        </TCollapseIcon>
      </portal>

      <t-pagination
        v-if="response.nbPages > 1 && !$route.query.search"
        v-model="currentPage"
        :total-items="response.nbHits"
        :per-page="response.hitsPerPage"
        class="mt-4"
      />

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
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
        v-if="response.nbPages > 1 && !$route.query.search"
        v-model="currentPage"
        :total-items="response.nbHits"
        :per-page="response.hitsPerPage"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import ls from 'local-storage'
import { getExcerpt, getOptions } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { objectivesList, typeList } from '~/use/profiles'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'

export default {
  name: 'ProfilesIndex',
  setup() {
    const radius = ref(50)
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()

    const { search, response } = useAlgolia('profiles')

    const facets = computed(() => ({
      country: getFacetOptions('country'),
      locality: getFacetOptions('locality'),
      type: getFacetOptions('type'),
      gender: getFacetOptions('gender'),
      objectives: getFacetOptions('objectives'),
      style: getFacetOptions('style')
    }))

    async function load() {
      filters.value = {}

      await search('', {
        facets: Object.keys(facets.value),
        aroundLatLngViaIP: !!radius.value,
        aroundRadius: radius.value * 1000 || 1
      })

      if (!response.value.hits.length) {
        radius.value = ''
      }
    }

    onMounted(load)

    const typeOptions = getOptions(typeList, 'All')

    const facetFilters = computed(() => {
      return Object.keys(filters.value)
        .filter((field) => filters.value[field])
        .map((field) => `${field}:${filters.value[field]}`)
        .join(',')
    })

    watch([currentPage, facetFilters, radius], () => {
      search(query.value, {
        facets: Object.keys(facets.value),
        facetFilters: facetFilters.value,
        page: currentPage.value - 1,
        aroundLatLngViaIP: !!radius.value,
        aroundRadius: radius.value * 1000 || 1
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
        label: 'in 10km radius',
        value: 10
      },
      {
        label: 'in 20km radius',
        value: 20
      },
      {
        label: 'in 50km radius',
        value: 50
      },
      {
        label: 'in 100km radius',
        value: 100
      },
      {
        label: 'in 500km radius',
        value: 500
      },
      {
        label: 'in 1000km radius',
        value: 1000
      },
      {
        label: `Anywhere`,
        value: ''
      }
    ]

    function feat(name) {
      return !!ls(name)
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
      feat,
      radius,
      load
    }
  }
}
</script>
