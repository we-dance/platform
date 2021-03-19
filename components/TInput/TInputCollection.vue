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
import { useApp } from '~/use/app'
import { getFields } from '~/use/forms'
import { search } from '~/utils'

export default {
  name: 'TInputCollection',
  props: {
    value: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    },
    orderBy: {
      type: String,
      default: 'name'
    },
    preFilter: {
      type: [Function, Boolean],
      default: false
    },
    keyLabel: {
      type: [Function, String],
      default: 'name'
    },
    keyValue: {
      type: String,
      default: 'id'
    },
    canAdd: {
      type: Boolean,
      default: false
    },
    addLabel: {
      type: String,
      default: 'Add new'
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    isAdding: false,
    newItem: {}
  }),
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async fetchOptions(q) {
      let results = []

      if (!this.cache) {
        return
      }

      const cached = ['cities', 'profiles']

      if (cached.includes(this.collection)) {
        await when(this.cache).not.toBeNull()

        const keys = Object.keys(this.cache[this.collection])
        for (const key of keys) {
          const doc = this.cache[this.collection][key]

          results.push({
            label: this.getLabel(doc),
            value: this.getValue(doc)
          })
        }
      } else {
        const docsRef = this.$fire.firestore
          .collection(this.collection)
          .orderBy(this.orderBy)

        const collection = await docsRef.get()

        results = collection.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .map((doc) => {
            return {
              label: this.getLabel(doc),
              value: this.getValue(doc)
            }
          })
      }

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
      return doc[this.keyValue]
    }
  },
  setup() {
    const { cache, read } = useApp()

    return {
      getFields,
      cache,
      read
    }
  }
}
</script>
