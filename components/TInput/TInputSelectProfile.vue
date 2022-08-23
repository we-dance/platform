<template>
  <div>
    <TInputSelect v-model="internalValue" :options="profiles" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object],
      default: () => ({}),
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      internalValue: this.value.username,
    }
  },
  computed: {
    profiles() {
      const options = this.options.map((profile) => ({
        value: profile.username,
        label: profile.username,
      }))
      return [...options, { value: '', label: '' }]
    },
  },
  watch: {
    internalValue(val) {
      const result = this.options.find((o) => o.username === val)
      this.$emit('input', result)
    },
    value(val) {
      this.internalValue = val.username
    },
  },
}
</script>
