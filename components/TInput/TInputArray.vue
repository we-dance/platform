<template>
  <div>
    <component
      :is="children.component"
      v-for="(child, index) in internalValue"
      :key="`${children.component}-${child.username || index}`"
      v-model="internalValue[index]"
      v-bind="children"
      :item="item"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String, Object],
      default: () => [],
    },
    item: {
      type: Object,
      default: () => ({}),
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
      if (typeof val === 'object') {
        val = Object.values(val)
      }

      const extra = [...val, {}]

      if (JSON.stringify(extra) === JSON.stringify(this.internalValue)) {
        return
      }

      this.internalValue = extra
    },
    internalValue: {
      deep: true,
      handler(val) {
        let filtered = []

        if (val) {
          filtered = val.filter((item) => item && Object.keys(item).length)
        }

        this.$emit('input', filtered)
      },
    },
  },
  mounted() {
    const val = this.value || []
    const extra = [...val, {}]

    this.internalValue = extra
  },
}
</script>
