<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    User not found
  </div>
  <div v-else>
    <TShareProfile :profile="profile" />
  </div>
</template>

<script>
import useRouter from '~/use/router'
import useDoc from '~/use/doc'
import useAuth from '~/use/auth'

export default {
  layout: 'empty',
  setup() {
    const { params } = useRouter()
    const { uid } = useAuth()
    const username = params.id

    const { doc: profile, id, loading, exists, find } = useDoc('profiles')
    find('username', username)

    return {
      profile,
      exists,
      loading,
      uid,
      id
    }
  }
}
</script>
