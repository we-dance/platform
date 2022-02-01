<template>
  <div>
    <component
      v-for="(item, index) in value"
      :key="`${children.component}-${index}`"
      :is="children.component"
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
  data: () => ({
    internalValue: [],
  }),
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
  watch: {
    internalValue: {
      deep: true,
      handler(val) {
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
