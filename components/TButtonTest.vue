<template>
  <button
    id="button"
    :style="style"
    :disabled="disabled"
    role="button"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'TButtonTest',
  props: {
    label: {
      type: String,
      default: 'Default Title',
    },
    background: {
      type: String,
      default: 'red',
    },
    padding: {
      type: Number,
      default: 2,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style() {
      return {
        backgroundColor: this.background,
        padding: this.padding + 'px',
      }
    },
  },
  methods: {
    onClick($event) {
      this.$emit('onClick', $event)
    },
    toJSON: () => {},
  },
}
</script>
