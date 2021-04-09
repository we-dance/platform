<template>
  <div>
    <TInput v-model="query" placeholder="Search dancers" @input="search" />

    <div class="mt-4 flex items-center space-x-2">
      <TTabs v-model="filters.type" :tabs="typeOptions" class="flex-grow" />
    </div>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 col-gap-2 row-gap-2">
      <router-link
        v-for="item in items"
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
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue-demi'
import { getExcerpt, getOptions } from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { typeList } from '~/use/profiles'

export default {
  name: 'ProfilesIndex',
  setup() {
    const query = ref('')
    const filters = ref({})

    const { search, items } = useAlgolia('profiles')

    onMounted(() => search())

    const typeOptions = getOptions(typeList, 'All')

    watch(filters.value, () => {
      const results = []
      Object.keys(filters.value).forEach((field) => {
        const value = filters.value[field]
        if (value) {
          results.push(`${field}:${value}`)
        }
      })

      const filterQuery = results.join(' ')
      search(query.value, { filters: filterQuery })
    })

    return {
      getExcerpt,
      search,
      query,
      items,
      typeOptions,
      filters
    }
  }
}
</script>
