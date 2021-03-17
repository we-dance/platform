<template>
  <main>
    App
  </main>
</template>

<script>
import { warmup } from '~/use/app'

export default {
  name: 'PageAdminApp',
  async asyncData() {
    await warmup()
  }
}
</script>
