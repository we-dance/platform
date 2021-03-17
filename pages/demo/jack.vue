<template>
  <pre>{{ app }}</pre>
</template>

<script>
import { useApp } from '~/use/jack'

export default {
  setup() {
    const app = useApp()

    return {
      app
    }
  }
}
</script>
