<template>
  <div v-html="require(`../static/svg/${name}.svg`)" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style></style>
