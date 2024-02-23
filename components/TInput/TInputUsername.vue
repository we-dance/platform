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
    lowerCase: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        let newVal = val

        if (this.lowerCase) {
          newVal = (newVal || '').toLowerCase()
        }

        this.$emit('input', newVal)
      },
    },
  },
}
</script>
