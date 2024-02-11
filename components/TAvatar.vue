<template>
  <div class="flex items-center space-x-1">
    <div v-if="photo">
      <NuxtLink :to="localePath(`/${profile.username}`)">
        <TProfilePhoto :uid="uid" :size="size" />
      </NuxtLink>
    </div>
    <div v-if="name">
      <NuxtLink
        v-if="profile.username"
        class="hover:underline font-bold"
        :to="localePath(`/${profile.username}`)"
      >
        {{ profile.name || profile.username }}
      </NuxtLink>
      <span v-else class="font-bold">{{ username }}</span>
    </div>
    <slot />
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
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
    username: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { getFullProfile } = useProfiles()

    const profile = ref({})
    onMounted(async () => {
      profile.value = await getFullProfile(props.uid)
    })

    return {
      profile,
    }
  },
}
</script>
