<template>
  <router-link
    :to="`/${profile.username}`"
    class="border rounded shadow text-sm bg-white overflow-hidden"
  >
    <div class="bg-gray-300">
      <TIcon v-if="!profile.photo" name="undraw_profile_pic" />
      <img v-else :src="profile.photo" />
    </div>
    <div>
      <div class="p-2 relative">
        <div>
          <span class="font-bold">{{ profile.name }}</span>
          <span v-if="profile.community" class="text-xs"
            >• {{ profile.community }}</span
          >
          <span v-if="profile.height" class="text-xs"
            >• {{ profile.height }}cm</span
          >
          <span v-if="profile.weight" class="text-xs"
            >• {{ profile.weight }}kg</span
          >
        </div>
        <div class="overflow-ellipsis overflow-hidden h-16">
          {{ profile.bio }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { getDateTime } from '~/utils'
import { useProfiles } from '~/use/profiles'

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
