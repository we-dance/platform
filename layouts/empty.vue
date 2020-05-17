<template>
  <nuxt />
</template>

<script>
import useAuth from '~/use/auth'

export default {
  data: () => ({}),
  setup() {
    const { isAdmin } = useAuth()

    return {
      isAdmin
    }
  }
}
</script>
