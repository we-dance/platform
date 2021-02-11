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
  name: 'UIdIndexRedirect',
  computed: {
    redirectUrl() {
      return `/${this.$route.params.id}`
    }
  },
  mounted() {
    this.$router.replace(this.redirectUrl)
  }
}
</script>
