<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    User not found
  </div>
  <div v-else>
    <div class="md:flex p-4">
      <TProfilePhoto size="xl" class="mx-auto md:m-0 md:mr-8 mb-4" :uid="id" />
      <div class="w-full">
        <div class="flex justify-between">
          <div class="text-center md:text-left">
            <div class="font-bold text-2xl leading-none">
              {{ profile.name }}
            </div>
            <div>@{{ profile.username }}</div>
          </div>

          <TProfileContact :uid="id" />
        </div>
        <dl v-if="profile.city" class="mt-2 md:flex">
          <dt class="font-bold mr-1">City:</dt>
          <dd>
            {{ profile.city }}
          </dd>
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
      <div v-if="profile.bio" class="mt-4">
        <h2 class="font-bold">About me:</h2>
        <div>{{ profile.bio }}</div>
      </div>
      <div v-if="profile.skills" class="mt-4">
        <h2 class="font-bold">Dance skills:</h2>
        <div>{{ profile.skills }}</div>
      </div>
      <dl v-if="profile.languages" class="mt-4">
        <dt class="font-bold mr-1">My languages:</dt>
        <dd>{{ profile.languages }}</dd>
      </dl>
      <div v-if="profile.learning" class="mt-4">
        <h2 class="font-bold">Which dance topics you are interested in?</h2>
        <div>{{ profile.learning }}</div>
      </div>
      <dl
        v-if="profile.partner"
        class="mt-4 bg-primary text-white px-4 py-1 rounded-full"
      >
        <dt class="font-bold mr-1">I am looking for partner</dt>
      </dl>
      <dl v-if="profile.partnerBio" class="mt-4">
        <dt class="font-bold mr-1">About my partner:</dt>
        <dd>{{ profile.partnerBio }}</dd>
      </dl>

      <div v-if="profile.story" class="mt-4">
        <h2 class="font-bold">My dance story:</h2>
        <TPreview :content="profile.story" />
      </div>
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
