<template>
  <div :class="classes" v-html="require(`../static/svg/${name}.svg`)" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
  },
  computed: {
    classes() {
      if (!this.size) {
        return ''
      }

      return `w-${this.size} h-${this.size}`
    },
  },
}
</script>
