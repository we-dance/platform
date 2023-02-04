<template>
  <TLoader />
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  layout: 'empty',
  setup() {
    const { signOut } = useAuth()
    return {
      signOut,
    }
  },
  async mounted() {
    await this.signOut()

    this.$router.back()
  },
}
</script>
