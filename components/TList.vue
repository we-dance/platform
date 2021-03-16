<template>
  <main>
    <TTitle>
      {{ title }}
      <template slot="right">
        <TButton :to="addUrl" type="primary" :label="add" />
      </template>
    </TTitle>

    <TFilters v-if="filters" v-model="filters" :fields="filterFields" />

    <div :class="listWrapper">
      <div v-for="item in results" :key="item.id">
        <slot name="item" v-bind="{ item }" />
      </div>
    </div>
  </main>
</template>

<script>
import useFilters from '~/use/filters'
import useCollection from '~/use/collection'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    add: {
      type: String,
      default: ''
    },
    addUrl: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    },
    filterFields: {
      type: Array,
      default: () => []
    },
    filterDefault: {
      type: Object,
      default: () => {}
    },
    listWrapper: {
      type: String,
      default: 'space-y-2'
    }
  },
  setup(params) {
    const { docs } = useCollection(params.collection)

    const { filters, results } = useFilters(
      docs,
      params.filterFields,
      params.filterDefault
    )

    return {
      filters,
      results
    }
  }
}
</script>
