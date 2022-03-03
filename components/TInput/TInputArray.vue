<template>
  <div>
    <component
      :is="children.component"
      v-for="(item, index) in value"
      :key="`${children.component}-${index}`"
      v-model="internalValue[index]"
      v-bind="children"
    />
    <component
      :is="children.component"
      v-model="internalValue[value.length]"
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
      this.internalValue = val
    },
    internalValue: {
      deep: true,
      handler(val, old) {
        if (val && old && val.length === old.length) {
          return
        }

        let filtered = []

        if (val) {
          filtered = val.filter((item) => item && item !== '' && item !== null)
        }

        this.$emit('input', filtered)
      },
    },
  },
  mounted() {
    this.internalValue = this.value || []
  },
}
</script>
