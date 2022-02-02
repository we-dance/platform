<template>
  <div>
    <THeader v-if="title" :title="title">
      <TButton v-if="add && can('add', collection)" @click="currentId = 'add'">
        {{ add }}
      </TButton>
    </THeader>

    <div v-if="!can('add', collection)">
      <slot name="auth" />
    </div>

    <slot name="header" />

    <div v-if="currentId === 'add'" class="mt-4 rounded bg-white mb-4 shadow">
      <TForm
        :fields="fields"
        show-cancel
        class="px-6 py-4 space-y-4"
        @save="createItem"
        @cancel="cancelItem"
      />
    </div>

    <div
      v-if="filters && filters.length > 1"
      class="mt-4 md:flex bg-orange-100 rounded shadow"
    >
      <button
        v-for="filter in filters"
        :key="filter.name"
        class="p-2 text-gray-700"
        :class="filter.name === activeFilter ? 'font-bold' : ''"
        @click="activeFilter = filter.name"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="!items.length">
      <slot name="empty">
        {{ empty }}
      </slot>
    </div>

    <div :class="wrapperClass">
      <div v-for="(item, itemId) in items" :key="item.id">
        <div class="flex justify-end">
          <slot name="card-toolbar" :item="item" />
        </div>
        <slot :item="item">
          <div :key="itemId" class="p-4">
            <TListItem :item="item" :fields="fields" />
            <TItemToolbar :item="item" :collection="collection" :edit="false">
              <TPopupEdit
                :fields="fields"
                label="Edit"
                :collection="collection"
                :item="item"
              />
            </TItemToolbar>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { sortBy } from '~/utils'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useCollection } from '~/use/collection'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    empty: {
      type: String,
      default: '',
    },
    wrapperClass: {
      type: String,
      default: 'space-y-4',
    },
    add: {
      type: String,
      default: '',
    },
    collection: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: () => [],
    },
    filters: {
      type: Array,
      default: () => [],
    },
    map: {
      type: [Function, Boolean],
      default: false,
    },
    deleteItem: {
      type: Boolean,
      default: false,
    },
    itemClass: {
      type: String,
      default: 'px-6 py-4 rounded bg-white mb-4 shadow',
    },
    itemLabel: {
      type: Function,
      default: (item) => {
        return item.name
      },
    },
  },
  data: () => ({
    currentId: false,
  }),
  watch: {
    items: 'loadItems',
  },
  setup(props) {
    const { docs } = useCollection(props.collection)
    const { update, remove, create } = useDoc(props.collection)
    const { can } = useAuth()

    const activeFilter = ref(
      props.filters.find((filter) => !!filter.default)?.name
    )

    const items = computed(() => {
      if (!docs.value) {
        return []
      }

      let result = docs.value

      if (props.map) {
        result = result.map(props.map)
      }

      if (!activeFilter.value) {
        return result
      }

      const filterObject = props.filters.find(
        (filter) => filter.name === activeFilter.value
      )

      if (filterObject.map) {
        result = result.map(filterObject.map)
      }

      if (filterObject.filter) {
        result = result.filter(filterObject.filter)
      }

      if (filterObject.sort) {
        result = result.sort(sortBy(filterObject.sort))
      }

      return result
    })

    return {
      can,
      update,
      create,
      remove,
      items,
      activeFilter,
    }
  },
  methods: {
    loadItems() {
      this.$emit('loadItems', this.items)
    },
    cancelItem() {
      this.currentId = false
    },
    async createItem(data) {
      this.cancelItem()
      await this.create(data)
    },
    async saveItem(data) {
      this.cancelItem()
      await this.update(data.id, data)
    },
    async removeItem(id) {
      this.cancelItem()
      await this.remove(id)
    },
  },
}
</script>
