<template>
  <TLoader />
</template>

<script>
import { onMounted } from '@vue/composition-api'
import useAuth from '~/use/auth'

export default {
  layout: 'empty',
  setup() {
    const { signOut } = useAuth()
    onMounted(() => {
      signOut()
    })
  }
}
</script>
