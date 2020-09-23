<template>
  <input
    ref="input"
    v-model="input"
    v-bind="$attrs"
    autocomplete="off"
    :type="type"
    class="w-full block bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
  />
</template>

<script>
import { sanitize } from '~/utils'

export default {
  name: 'TInput',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    trim: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    input: ''
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
    }
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
    }
  }
}
</script>
