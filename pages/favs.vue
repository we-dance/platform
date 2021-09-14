<template>
  <div>
    <THeader title="Saved" />
    <TPostList :filter="{ [`savedBy.${uid}`]: true }" />
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid,
    }
  },
}
</script>
