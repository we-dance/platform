<template>
  <portal to="right">
    <slot />
  </portal>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    noClose: {
      type: Boolean,
      default: false
    }
  }
}
</script>
