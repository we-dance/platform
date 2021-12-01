<template>
  <div class="w-full relative flex justify-center">
    <TButton
      v-for="option in options"
      :key="getValue(option)"
      :value="getValue(option)"
      class="m-1 whitespace-no-wrap"
      :type="value === getValue(option) ? 'secondary' : 'simple'"
      @click="change(getValue(option))"
      >{{ getLabel(option) }}</TButton
    >
  </div>
</template>

<script>
import { camelcase } from '~/utils'

export default {
  name: 'TInputButtons',
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    defaultValue: {
      type: [String, Number, Boolean],
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    if (!this.value) {
      this.$emit('input', this.defaultValue)
    }
  },
  methods: {
    change(val) {
      if (val === this.value) {
        this.$emit('input', '')
        return
      }

      this.$emit('input', val)
    },
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
