<template>
  <component :is="editor" v-model="internalValue" :options="scalarOptions" />
</template>

<script>
import { getObjectKeysFromArray } from '~/utils'

export default {
  props: {
    value: {
      type: [Array, Object],
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    valueField: {
      type: String,
      default: 'value',
    },
    labelField: {
      type: String,
      default: 'label',
    },
    editor: {
      type: String,
      default: 'TInputMulti',
    },
  },
  data: () => ({
    internalValue: {},
  }),
  computed: {
    scalarOptions() {
      return this.options.map((item) => ({
        value: item[this.valueField],
        label: item[this.labelField],
      }))
    },
  },
  watch: {
    internalValue() {
      const result = this.options.filter(
        (option) => this.internalValue[option[this.valueField]]
      )
      this.$emit('input', result)
    },
    value(val, oldVal) {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) {
        return
      }

      if (!this.value) {
        return
      }

      this.internalValue = getObjectKeysFromArray(
        this.value.map((item) => item[this.valueField])
      )
    },
  },
  mounted() {
    if (!this.value) {
      return
    }

    this.internalValue = getObjectKeysFromArray(
      this.value.map((item) => item[this.valueField])
    )
  },
}
</script>
