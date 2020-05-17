<template>
  <TLoader />
</template>

<script>
import { onMounted } from '@vue/composition-api'
import useAuth from '~/use/auth'
import TLoader from '~/components/TLoader'

export default {
  components: {
    TLoader
  },
  layout: (ctx) => (ctx.isMobile ? 'mobile' : 'desktop'),
  setup() {
    const { signOut } = useAuth()
    onMounted(() => {
      signOut()
    })
  }
}
</script>
