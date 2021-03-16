<template>
  <div>
    <t-rich-select v-model="internalValue" :fetch-options="fetchOptions">
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
        <TForm v-model="newItem" :fields="getFields(collection)" />
      </div>
    </TPopup>
  </div>
</template>

<script>
import useProfiles from '~/use/profiles'
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
      const docsRef = this.$fire.firestore
        .collection(this.collection)
        .orderBy(this.orderBy)

      const collection = await docsRef.get()

      let results = collection.docs.map((doc) => {
        return {
          label: this.getLabel(doc),
          value: this.getValue(doc)
        }
      })

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
      const item = doc.data()

      let profile = {}

      if (item.createdBy) {
        profile = this.getProfile(item.createdBy)
      }

      if (typeof this.keyLabel === 'function') {
        return this.keyLabel(item, profile)
      }

      return item[this.keyLabel]
    },
    getValue(doc) {
      if (this.keyValue === 'id') {
        return doc.id
      }
      return doc.data()[this.keyValue]
    }
  },
  setup() {
    const { getProfile } = useProfiles()

    return {
      getProfile,
      getFields
    }
  }
}
</script>
