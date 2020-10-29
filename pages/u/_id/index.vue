<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    User not found
  </div>
  <div v-else class="mx-auto max-w-md bg-real-white p-4">
    <TProfileDancer v-if="profile.type === 'Dancer'" :profile="profile" />
    <TProfileOrganiser v-if="profile.type === 'Organiser'" :profile="profile" />
  </div>
</template>

<script>
import useRouter from '~/use/router'
import useDoc from '~/use/doc'
import useAuth from '~/use/auth'

export default {
  layout: 'public',
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
  },
  mounted() {
    if (this.uid) {
      this.$nuxt.setLayout('default')
    }
  }
}
</script>
