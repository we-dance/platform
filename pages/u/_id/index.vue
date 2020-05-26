<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    User not found
  </div>
  <div v-else>
    <div class="flex p-4">
      <img class="rounded-full w-32 h-32 mr-8 mb-2" :src="profile.photo" />
      <div>
        <div class="font-bold text-2xl leading-none">{{ profile.name }}</div>
        <div>@{{ profile.username }}</div>
        <dl class="mt-2 md:flex">
          <dt class="font-bold mr-1">Location:</dt>
          <dd>{{ profile.location }}</dd>
        </dl>
        <dl class="mt-2 md:flex">
          <dt class="font-bold mr-1">Joined:</dt>
          <dd>{{ getDateTime(profile.createdAt) }}</dd>
        </dl>
      </div>
    </div>
    <div v-if="uid === id" class="p-4">
      <TButton to="/settings?tab=profile">Edit Profile</TButton>
    </div>
    <div class="p-4">
      <div>{{ profile.summary }}</div>
      <dl v-if="profile.skills" class="mt-2 md:flex">
        <dt class="font-bold mr-1">Dance Skills:</dt>
        <dd>{{ profile.skills }}</dd>
      </dl>
      <dl v-if="profile.learning" class="mt-2 md:flex">
        <dt class="font-bold mr-1">I am getting into:</dt>
        <dd>{{ profile.learning }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import useRouter from '~/use/router'
import useDoc from '~/use/doc'
import useAuth from '~/use/auth'
import { getDateTime } from '~/utils'

export default {
  layout: 'minimal',
  setup() {
    const { params } = useRouter()
    const { uid } = useAuth()
    const username = params.id

    const { doc: profile, id, loading, exists, find } = useDoc('profiles')
    find('username', username)

    return {
      profile,
      getDateTime,
      exists,
      loading,
      uid,
      id
    }
  }
}
</script>
