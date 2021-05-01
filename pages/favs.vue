<template>
  <TPostList :filter="{ [`savedBy.${uid}`]: true }" />
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>
