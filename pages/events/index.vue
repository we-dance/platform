<template>
  <main>
    <THeader title="Events" />
    <div>Redirecting</div>
  </main>
</template>

<script>
export default {
  name: 'Events',
  mounted() {
    this.$router.push('/feed')
  },
}
</script>
