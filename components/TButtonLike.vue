<template>
  <TButton
    icon="favorite"
    type="nav"
    :label="count"
    :class="{ 'text-primary': value, 'text-gray-700': !value }"
    v-bind="$attrs"
    @click="onClick"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onClick() {
      this.$fire.analytics.logEvent('like')
      this.$emit('change', !this.value)
    },
  },
}
</script>
