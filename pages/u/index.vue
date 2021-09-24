<template>
  <div>
    Redirecting to
    <router-link
      class="underline hover:no-underline text-blue-700"
      :to="redirectUrl"
      >{{ redirectUrl }}</router-link
    >...
  </div>
</template>

<script>
export default {
  layout: 'popup',
  name: 'URedirect',
  computed: {
    redirectUrl() {
      return `/community`
    },
  },
  mounted() {
    this.$router.replace(this.redirectUrl)
  },
}
</script>
