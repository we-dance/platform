<template>
  <div class="p-4 font-mono">{{ ua }}</div>
</template>

<script>
const ua = process.client
  ? navigator.userAgent || navigator.vendor || window.opera
  : 'server'

export default {
  computed: {
    ua() {
      return ua
    },
  },
}
</script>
