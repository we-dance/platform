<template>
  <div>
    <component
      :is="children.component"
      v-for="(item, index) in internalValue"
      :key="`${children.component}-${item.username}-${index}`"
      v-model="internalValue[index]"
      v-bind="children"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String],
      default: () => [],
    },
    children: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    internalValue: [],
  }),
  watch: {
    value(val) {
      if (JSON.stringify(val) === JSON.stringify(this.internalValue)) {
        return
      }

      this.internalValue = val
    },
    internalValue: {
      deep: true,
      handler(val) {
        let filtered = []

        if (val) {
          filtered = val.filter((item) => item && Object.keys(item).length)
        }

        filtered.push({})

        this.$emit('input', filtered)
      },
    },
  },
  mounted() {
    this.internalValue = this.value || []
  },
}
</script>
