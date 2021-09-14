<template>
  <div>
    <TInput
      v-model="computedValue"
      trim="[^a-z0-9]+"
      v-bind="$attrs"
      @input="save"
    />
    <div v-if="error" class="p-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  setup() {
    const { set, remove, load, doc, exists } = useDoc('urls')

    return {
      set,
      remove,
      load,
      doc,
      exists,
    }
  },
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    computedValue: '',
    error: '',
  }),
  mounted() {
    this.computedValue = this.value
  },
  methods: {
    async save(newName) {
      this.error = ''

      if (newName === this.value) {
        return
      }

      await this.load(newName)

      if (this.exists) {
        this.error = 'This name is already taken'
        return
      }

      if (this.value) {
        this.remove(this.value)
      }

      this.set(newName, {
        target: this.target,
      })

      this.$emit('input', newName)
    },
  },
}
</script>
