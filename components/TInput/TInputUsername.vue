<template>
  <div>
    <TInput
      v-model="computedValue"
      trim="[^a-z0-9._]+"
      v-bind="$attrs"
      @input="save"
    />
    <div v-if="error" class="p-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  name: 'TInputUsername',
  setup() {
    const { find, id } = useDoc('profiles')

    return {
      find,
      id,
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
  watch: {
    value(val) {
      if (val) {
        this.computedValue = this.value
      }
    },
  },
  mounted() {
    this.computedValue = this.value
  },
  methods: {
    async save(newName) {
      this.error = ''

      if (newName === this.value) {
        return
      }

      await this.find('username', newName)

      if (this.id && this.id !== this.item.id) {
        this.error = 'This name is already taken'
        this.$emit('input', this.value)
        return
      }

      this.$emit('input', newName)
    },
  },
}
</script>
