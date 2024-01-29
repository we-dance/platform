<template>
  <div class="p-4 font-mono">{{ ua }}</div>
</template>

<script>
const ua = navigator.userAgent || navigator.vendor || window.opera

export default {
  computed: {
    ua() {
      return ua
    },
  },
}
</script>
