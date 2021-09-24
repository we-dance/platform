<template>
  <div>
    <pre>Maker: {{ maker }}</pre>
    <pre>App: {{ app }}</pre>
  </div>
</template>

<script>
import { inject } from '@nuxtjs/composition-api'
import { useApp } from '~/use/app'

export default {
  setup() {
    const app = useApp()
    const maker = inject('maker')

    return {
      app,
      maker,
    }
  },
}
</script>
