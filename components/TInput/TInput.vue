<template>
  <vt-input ref="input" v-model="input" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import { sanitize } from '~/utils'

export default {
  name: 'TInput',
  props: {
    value: {
      type: [String, Number, Object, Date],
      default: '',
    },
    trim: {
      type: String,
      default: '',
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    input: '',
  }),
  watch: {
    input(val, oldVal) {
      if (val !== oldVal) {
        this.sanitize()
      }

      this.$emit('input', val)
    },
    value(val) {
      this.input = val
    },
  },
  mounted() {
    this.input = this.value

    if (this.autoFocus) {
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      })
    }
  },
  methods: {
    sanitize() {
      if (this.trim) {
        this.input = sanitize(this.input, this.trim)
      }
    },
  },
}
</script>
