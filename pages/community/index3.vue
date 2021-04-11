<template>
  <div>
    <TInput
      v-if="$route.query.search"
      v-model="query"
      auto-focus
      placeholder="Search dancers"
      class="mb-4"
      @input="search"
    />

    <portal to="right">
      <TCollapseIcon
        v-if="response.facets"
        title="Filter"
        icon="tune"
        desktop-class="w-56 space-y-2 p-4"
      >
        <button
          v-if="Object.keys(filters).length"
          class="rounded-full px-2 py-1 bg-gray-200 inline-block cursor-pointer mb-4"
          @click="setFilter()"
        >
          Reset {{ Object.keys(filters).length }} filters
        </button>
        <div v-for="field in facets" :key="field" class="space-y-1">
          <h4 class="font-bold text-gray-700">
            {{ $t(`profile.${field}`) }}
          </h4>
          <div v-for="(count, value) in response.facets[field]" :key="value">
            <button
              class="rounded-full px-2 py-1 bg-gray-200 inline-block cursor-pointer"
              :class="{ 'font-bold': filters[field] === value }"
              @click="setFilter(field, value)"
            >
              {{ getFieldLabel(field, value) }}
              <span
                class="rounded-full text-xs bg-blue-500 text-white h-5 px-1 inline-block"
                >{{ count }}</span
              >
            </button>
          </div>
        </div>
      </TCollapseIcon>
    </portal>

    <div class="flex items-center space-x-2">
      <TTabs v-model="profileType" :tabs="typeOptions" class="flex-grow" />
    </div>

    <t-pagination
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="mt-4"
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
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="mt-4"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, onMounted, ref, watch } from 'vue-demi'
import { until } from '@vueuse/core'
import { getExcerpt, getOptions } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { objectivesList, typeList } from '~/use/profiles'
import { useAuth } from '~/use/auth'
import { useStyles } from '~/use/styles'

export default {
  name: 'ProfilesIndex',
  setup() {
    const query = ref('')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid, profile } = useAuth()

    const { search, response } = useAlgolia('profiles')

    const myFilter = computed(() => {
      if (!uid.value) {
        return ''
      }

      let parts = []

      if (profile.value.styles) {
        parts.push(Object.keys(profile.value.styles).join(' OR '))
      }

      if (profile.value.objectives) {
        parts.push(
          Object.keys(profile.value.objectives)
            .map((objective) => `objectives:${objective}`)
            .join(' OR ')
        )
      }

      if (profile.value.locales) {
        parts.push(
          Object.keys(profile.value.locales)
            .map((locale) => `locales:${locale}`)
            .join(' OR ')
        )
      }

      parts.push(
        `gender:${profile.value.gender === 'Male' ? 'Female' : 'Male'}`
      )

      parts.push(`place:${profile.value.place}`)

      parts = parts.map((part) => `(${part})`)

      return parts.join(' AND ')
    })

    const facets = ['country', 'locality', 'gender', 'objectives', 'style']

    onMounted(async () => {
      if (uid.value) {
        await until(profile).not.toBeNull()
      }

      await search('', {
        filters: myFilter.value,
        facets
      })
    })

    const typeOptions = getOptions(typeList, 'For You')

    const filterQuery = computed(() => {
      if (profileType.value) {
        return `type:${profileType.value}`
      } else {
        return myFilter.value
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

    function getFieldLabel(field, value) {
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
