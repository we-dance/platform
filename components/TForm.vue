<template>
  <div>
    <div v-for="field in fields" :key="field.name" class="mb-4">
      <TField
        v-model="data[field.name]"
        v-bind="field"
        :label="getLabel(field)"
      />
    </div>
    <div v-if="error" class="text-red-500 py-4 text-right">
      {{ error.message }}
    </div>
    <div class="flex justify-between items-center">
      <div>
        <TButton
          v-if="showRemove"
          icon="delete"
          color="red-500"
          @click="remove"
        />
      </div>

      <div class="flex">
        <TButton
          v-if="showCancel"
          type="secondary"
          class="mr-2"
          @click="cancel"
        >
          Cancel
        </TButton>
        <TButton type="primary" @click="save">{{ submitLabel }}</TButton>
      </div>
    </div>
  </div>
</template>

<script>
import { camelcase } from '~/utils'
import TField from '~/components/TField'

export default {
  name: 'TForm',
  components: {
    TField
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    },
    submitLabel: {
      type: String,
      default: 'Save'
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    data: {},
    error: false
  }),
  watch: {
    value: 'load',
    fields: 'load'
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const data = { ...this.value }
      this.data = data
    },
    remove() {
      this.$emit('remove', this.data.id)
    },
    cancel() {
      this.$emit('cancel')
    },
    getLabel(field) {
      if (typeof field === 'string') {
        return camelcase(field)
      }

      if (field.label) {
        return field.label
      }

      return camelcase(field.name)
    },
    validate() {
      return true
    },
    save() {
      this.error = false

      if (!this.validate()) {
        return
      }

      this.$emit('save', this.data)
    }
  }
}
</script>
