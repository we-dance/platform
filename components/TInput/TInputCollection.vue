<template>
  <div>
    <t-rich-select
      v-model="internalValue"
      :fetch-options="fetchOptions"
      v-bind="$attrs"
    >
      <template v-if="canAdd" v-slot:dropdownDown>
        <TButton
          type="link"
          class="m-4"
          :label="addLabel"
          @click="isAdding = true"
        />
      </template>
    </t-rich-select>
    <TPopup
      v-if="isAdding"
      :title="`Adding to ${collection}`"
      @close="isAdding = false"
    >
      <div class="max-w-md mx-auto py-4 h-64 overflow-y-scroll">
        <TForm
          v-model="newItem"
          :fields="getFields(collection)"
          class="space-y-4"
        />
      </div>
    </TPopup>
  </div>
</template>

<script>
import { when } from '@vueuse/core'
import { db } from '~/plugins/firebase'
import { useApp } from '~/use/app'
import { getFields } from '~/use/forms'
import { search, sortBy } from '~/utils'

export default {
  name: 'TInputCollection',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    collection: {
      type: String,
      default: '',
    },
    orderBy: {
      type: String,
      default: 'name',
    },
    preFilter: {
      type: [Function, Boolean],
      default: false,
    },
    keyLabel: {
      type: [Function, String],
      default: 'name',
    },
    keyValue: {
      type: String,
      default: 'id',
    },
    canAdd: {
      type: Boolean,
      default: false,
    },
    addLabel: {
      type: String,
      default: 'Add new',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    isAdding: false,
    newItem: {},
  }),
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    async fetchOptions(q) {
      let results = []

      const cached = ['cities', 'profiles']

      if (cached.includes(this.collection)) {
        await this.isReady

        const keys = Object.keys(this.cache[this.collection])
        for (const key of keys) {
          const doc = this.cache[this.collection][key]

          results.push({
            label: this.getLabel(doc),
            value: key,
          })
        }
      } else {
        const docsRef = db.collection(this.collection).orderBy(this.orderBy)

        const collection = await docsRef.get()

        results = collection.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .map((doc) => {
            return {
              label: this.getLabel(doc),
              value: this.getValue(doc),
            }
          })
      }

      results = results.sort(sortBy('label'))

      if (this.preFilter) {
        results = results.filter(this.preFilter)
      }

      results = results.filter((i) => i.label)

      if (q) {
        results = results.filter((i) => search(i.label, q))
      }

      return { results }
    },
    getLabel(doc) {
      const item = doc

      const creator = this.read('profiles', item.createdBy, 'username')

      if (typeof this.keyLabel === 'function') {
        return this.keyLabel(item, creator)
      }

      return item[this.keyLabel]
    },
    getValue(doc) {
      if (this.keyValue === '@doc') {
        return doc
      }

      return doc[this.keyValue]
    },
  },
  setup() {
    const { cache, read } = useApp()
    const isReady = when(cache).not.toBeUndefined()

    return {
      getFields,
      cache,
      read,
      isReady,
    }
  },
}
</script>
