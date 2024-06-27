<template>
  <label>
    <vt-checkbox v-model="input" v-bind="$attrs" v-on="$listeners" />
    <span class="text-sm mx-2 text-gray-700">{{ label }}</span>
  </label>
</template>

<script>
import { sanitize } from '~/utils'

export default {
  name: 'TInput',
  props: {
    value: {
      type: [String, Number, Object, Date, Boolean],
      default: '',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: '',
    },
  },
  computed: {
    input: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
