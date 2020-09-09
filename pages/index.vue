<template>
  <div></div>
</template>

<script>
import ls from 'local-storage'

export default {
  layout: 'default',
  mounted() {
    const city = ls('city')

    if (city) {
      this.$router.push('/feed')
    }
  }
}
</script>
