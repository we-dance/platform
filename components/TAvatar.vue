<template>
  <div class="flex items-center">
    <div v-if="photo">
      <router-link :to="`/${profile.username}`">
        <TProfilePhoto :uid="uid" :size="size" />
      </router-link>
    </div>
    <div v-if="name">
      <router-link class="hover:underline" :to="`/${profile.username}`">
        {{ profile.username }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { useProfiles } from '~/use/profiles'

export default {
  name: 'TAvatar',
  props: {
    uid: {
      type: String,
      default: '',
    },
    photo: {
      type: Boolean,
      default: false,
    },
    name: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'xs',
    },
  },
  setup(props) {
    const { getProfile } = useProfiles()

    const profile = getProfile(props.uid)

    return {
      profile,
    }
  },
}
</script>
