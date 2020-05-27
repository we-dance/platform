<template>
  <div class="rounded border shadow p-4 bg-white">
    <router-link
      :to="`/u/${profile.username}`"
      class="text-sm flex items-center"
    >
      <img
        v-if="profile.photo"
        :class="`rounded-full mr-2 w-10 h-10`"
        :src="profile.photo"
      />
      <div v-else :class="`rounded-full mr-2 w-10 h-10 bg-orange-500`"></div>
      <div>
        <div class="font-bold">
          {{ profile.name }}
        </div>
        <div class="text-gray-600">@{{ profile.username }}</div>
      </div>
    </router-link>
    <div class="text-sm mt-2">
      <div>{{ profile.bio }}</div>
      <dl v-if="profile.city" class="mt-2">
        <dt class="font-bold mr-1">City:</dt>
        <dd>{{ profile.city }}</dd>
      </dl>
      <dl class="mt-2">
        <dt class="font-bold mr-1">Joined:</dt>
        <dd>{{ getDateTime(profile.createdAt) }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'TAvatar',
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
