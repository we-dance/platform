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

          <div class="space-y-4">
            <button
              v-if="Object.keys(filters).length"
              class="rounded-full px-2 py-1 bg-gray-200 inline-block cursor-pointer"
              @click="setFilter()"
            >
              Reset {{ Object.keys(filters).length }} filters
            </button>

            <t-rich-select
              v-for="field in facets"
              :key="field"
              :placeholder="$t(`profile.${field}`)"
              :options="getFacetOptions(field)"
              clearable
              hide-search-box
              @input="(val) => setFilter(field, val)"
            />
          </div>
        </TCollapseIcon>
      </portal>

      <t-pagination
        v-if="response.nbPages > 1 && !$route.query.search"
        v-model="currentPage"
        :total-items="response.nbHits"
        :per-page="response.hitsPerPage"
      />

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 col-gap-2 row-gap-2">
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
import Vue from 'vue'
import { computed, onMounted, ref, watch } from 'vue-demi'
import { getExcerpt, getOptions } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { objectivesList, typeList } from '~/use/profiles'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'

export default {
  name: 'ProfilesIndex',
  setup() {
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()

    const { search, response } = useAlgolia('profiles')

    const facets = [
      'country',
      'locality',
      'type',
      'gender',
      'objectives',
      'style'
    ]

    onMounted(async () => {
      await search('', {
        facets
      })
    })

    const typeOptions = getOptions(typeList, 'All')

    const filterQuery = computed(() => {
      if (profileType.value) {
        return `type:${profileType.value}`
      } else {
        return ''
      }
    })

    const facetFilters = computed(() => {
      return Object.keys(filters.value).map(
        (field) => `${field}:${filters.value[field]}`
      )
    })

    const facetFiltersStr = computed(() => {
      return facetFilters.value.join(',')
    })

    function setFilter(field, value) {
      if (!field) {
        filters.value = {}
      } else if (!value) {
        Vue.delete(filters.value, field)
      } else if (filters.value[field] === value) {
        Vue.delete(filters.value, field)
      } else {
        Vue.set(filters.value, field, value)
      }
    }

    watch([currentPage, filterQuery, facetFiltersStr], () => {
      search(query.value, {
        filters: filterQuery.value,
        facets,
        facetFilters: facetFilters.value,
        page: currentPage.value - 1
      })
      window.scrollTo(0, 0)
    })

    const { getStyleName } = useStyles()

    function getFacetOptions(field) {
      if (!response.value || !response.value.facets[field]) {
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

    return {
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
      setFilter,
      getFieldLabel
    }
  }
}
</script>
