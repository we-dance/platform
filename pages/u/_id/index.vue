<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    User not found
  </div>
  <div v-else>
    <div class="flex p-4">
      <img class="rounded-full w-32 h-32 mr-8 mb-2" :src="account.photo" />
      <div>
        <div class="font-bold text-2xl leading-none">{{ account.name }}</div>
        <div>@{{ account.username }}</div>
        <dl class="mt-2 md:flex">
          <dt class="font-bold mr-1">Location:</dt>
          <dd>{{ account.location }}</dd>
        </dl>
        <dl class="mt-2 md:flex">
          <dt class="font-bold mr-1">Joined:</dt>
          <dd>{{ getDateTime(account.createdAt) }}</dd>
        </dl>
      </div>
    </div>
    <div v-if="uid === id" class="p-4">
      <TButton to="/account?tab=settings">Edit Profile</TButton>
    </div>
    <div class="p-4">
      <div>{{ account.summary }}</div>
      <dl v-if="account.skills" class="mt-2 md:flex">
        <dt class="font-bold mr-1">Dance Skills:</dt>
        <dd>{{ account.skills }}</dd>
      </dl>
      <dl v-if="account.learning" class="mt-2 md:flex">
        <dt class="font-bold mr-1">I am getting into:</dt>
        <dd>{{ account.learning }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import TLoader from '~/components/TLoader'
import TButton from '~/components/TButton'
import useRouter from '~/use/router'
import useDoc from '~/use/doc'
import useAuth from '~/use/auth'
import { getDateTime } from '~/utils'

export default {
  layout: 'minimal',
  components: {
    TLoader,
    TButton
  },
  setup() {
    const { params } = useRouter()
    const { uid } = useAuth()
    const username = params.id

    const { doc: account, id, loading, exists, find } = useDoc('accounts')
    find('username', username)

    return {
      account,
      getDateTime,
      exists,
      loading,
      uid,
      id
    }
  }
}
</script>
