<template>
  <div class="flex items-center space-x-1">
    <div v-if="photo">
      <NuxtLink :to="`/${profile.username}`">
        <TProfilePhoto :uid="uid" :size="size" />
      </NuxtLink>
    </div>
    <div v-if="name">
      <NuxtLink class="hover:underline" :to="`/${profile.username}`">
        {{ profile.username }}
      </NuxtLink>
    </div>
    <slot />
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
