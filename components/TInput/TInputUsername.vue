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
export default {
  name: 'TInputUsername',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    },
    error: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    computedValue: ''
  }),
  watch: {
    value(val) {
      if (val) {
        this.computedValue = this.value
      }
    }
  },
  mounted() {
    this.computedValue = this.value
  },
  methods: {
    save(newName) {
      if (newName === this.value) {
        return
      }

      this.$emit('input', newName)
    }
  }
}
</script>
