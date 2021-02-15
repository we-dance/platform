<template>
  <TButton
    icon="favorite"
    type="icon"
    :label="count"
    :class="{ 'text-primary': value, 'text-gray-700': !value }"
    v-bind="$attrs"
    @click="$emit('change', !value)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>
