<template>
  <vt-input v-model="internalValue" />
</template>

<script>
export default {
  name: 'TInputZipcode',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Zipcode'
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        console.log('zipcode set', val)
      }
    }
  },
  setup(props, { emit }) {}
}
</script>
