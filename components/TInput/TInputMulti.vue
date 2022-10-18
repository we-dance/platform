<template>
  <div class="flex flex-col">
    <label
      v-for="option in options"
      :key="getValue(option)"
      class="inline-flex items-center mt-3"
    >
      <input
        v-model="internalValue"
        class="h-5 w-5 text-blue-600 rounded-sm"
        :value="getValue(option)"
        type="checkbox"
      />
      <span class="ml-2 text-gray-700">
        {{ getLabel(option) }}
      </span>
    </label>
  </div>
</template>

<script>
import { camelcase, getObjectKeysFromArray } from '~/utils'

export default {
  name: 'TInputMulti',
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    internalValue: {
      get() {
        return Object.keys(this.value).filter((e) => !!e)
      },
      set(val) {
        this.$emit('input', getObjectKeysFromArray(val))
      },
    },
  },
  methods: {
    getValue(field) {
      if (typeof field === 'string') {
        return field
      }

      if (field.value) {
        return field.value
      }

      return field.name
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
  },
}
</script>
