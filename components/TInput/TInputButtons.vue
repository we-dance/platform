<template>
  <div class="flex justify-center overflow-x-scroll">
    <div class="flex flex-nowrap">
      <TButton
        v-for="option in options"
        :key="getValue(option)"
        allow-guests
        :value="getValue(option)"
        :to="option.to"
        class="m-1"
        :type="value === getValue(option) ? 'toggled' : 'simple'"
        @click="change(getValue(option))"
        >{{ getLabel(option) }}</TButton
      >
    </div>
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
      type: [String, Number, Boolean, Object],
      default: '',
    },
    defaultValue: {
      type: [String, Number, Boolean, Object],
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
