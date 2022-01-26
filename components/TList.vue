<template>
  <main>
    <THeader v-if="title" :title="title" />

    <div v-if="tabs.length" class="flex items-center space-x-2 px-2">
      <TTabs v-model="sorting" :tabs="tabs" class="flex-grow" />
      <div v-if="false">
        <TButton
          v-if="view === 'list'"
          icon="news"
          type="icon"
          @click="view = 'covers'"
        />
        <TButton
          v-if="view === 'covers'"
          icon="notes"
          type="icon"
          @click="view = 'list'"
        />
      </div>
    </div>

    <TFilters
      v-if="filters.length"
      v-model="filters"
      :fields="filterFields"
      class="px-2"
    />

    <slot name="before" v-bind="{ count: results.length }" />

    <div :class="listWrapper">
      <div v-for="item in results" :key="item.id">
        <slot name="item" v-bind="{ item }" />
      </div>
    </div>

    <slot name="after" v-bind="{ count: results.length }" />
  </main>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useFilters } from '~/use/filters'
import { useCollection } from '~/use/collection'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    add: {
      type: String,
      default: '',
    },
    addUrl: {
      type: String,
      default: '',
    },
    collection: {
      type: String,
      default: '',
    },
    filterFields: {
      type: Array,
      default: () => [],
    },
    filterDefault: {
      type: Object,
      default: () => ({}),
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: String,
      default: '',
    },
    listWrapper: {
      type: String,
      default: 'mt-2 space-y-2',
    },
  },
  setup(params) {
    const { docs } = useCollection(params.collection)
    const sorting = ref(params.sortBy)

    const view = ref('covers')
    const viewOptions = [
      {
        value: 'covers',
        label: 'Grid View',
      },
      {
        value: 'text',
        label: 'List View',
      },
    ]

    const { filters, results } = useFilters(
      docs,
      params.filterFields,
      params.filterDefault,
      sorting
    )

    return {
      filters,
      results,
      sorting,
      view,
      viewOptions,
    }
  },
}
</script>
