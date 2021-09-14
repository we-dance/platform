<template>
  <div>
    <div class="border rounded p-4">
      <div>Browser: {{ browser }}</div>
      <div>In App: {{ isInApp ? 'Yes' : 'No' }}</div>
    </div>

    <div class="mt-4"><a :href="link" target="_blank">Open in Browser</a></div>
  </div>
</template>

<script>
import InApp from 'detect-inapp'
const inapp = new InApp(navigator.userAgent || navigator.vendor || window.opera)

export default {
  computed: {
    link() {
      return location.href
    },
    browser() {
      return inapp.browser
    },
    isInApp() {
      return inapp.isInApp
    },
  },
}
</script>
