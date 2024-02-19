<template>
  <TInput
    v-model="internalValue"
    trim="[^a-z0-9._\-]+"
    maxlength="30"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'TInputUsername',
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
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val.toLowerCase())
      },
    },
  },
}
</script>
