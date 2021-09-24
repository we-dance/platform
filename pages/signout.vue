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
    const target = this.$route.query.target || '/'

    await this.signOut()

    this.$router.replace(target)
  },
}
</script>
