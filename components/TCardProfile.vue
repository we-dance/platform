<template>
  <div class="rounded border shadow p-4 bg-white">
    <router-link
      :to="`/u/${profile.username}`"
      class="text-sm flex items-center"
    >
      <TProfilePhoto size="lg" :uid="uid" class="mr-2" />
      <div>
        <div class="font-bold">
          {{ profile.name }}
        </div>
        <div class="text-gray-600">@{{ profile.username }}</div>
      </div>
    </router-link>
    <div class="text-sm mt-2">
      <div>{{ profile.bio }}</div>
      <dl class="mt-2 md:flex">
        <dt class="font-bold mr-1">Joined:</dt>
        <dd>{{ getDateTime(profile.createdAt) }}</dd>
      </dl>
      <dl v-if="profile.city" class="mt-1 md:flex">
        <dt class="font-bold mr-1">City:</dt>
        <dd>{{ profile.city }}</dd>
      </dl>
      <dl v-if="profile.skills" class="mt-1 md:flex">
        <dt class="font-bold mr-1">Dance Skills:</dt>
        <dd>{{ profile.skills }}</dd>
      </dl>
      <dl v-if="profile.learning" class="mt-1 md:flex">
        <dt class="font-bold mr-1">I am getting into:</dt>
        <dd>{{ profile.learning }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'TCardProfile',
  props: {
    uid: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { getProfile } = useProfiles()

    const profile = getProfile(props.uid)

    return {
      getProfile,
      getDateTime,
      profile
    }
  }
}
</script>
