<template>
  <div>
    Redirecting to
    <router-link
      class="underline hover:no-underline text-blue-700"
      to="/?city=Munich"
      >WeDance</router-link
    >...
  </div>
</template>

<script>
export default {
  layout: 'popup',
  mounted() {
    this.$router.replace('/?city=Munich')
  }
}
</script>
