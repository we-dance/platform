<template>
  <div class="flex items-center">
    <div v-if="photo">
      <TMenu hover>
        <template v-slot:button>
          <router-link :to="`/u/${profile.username}`">
            <TProfilePhoto :uid="uid" :size="size" />
          </router-link>
        </template>
        <template v-slot:menu>
          <TCardProfile class="w-64" :uid="uid" />
        </template>
      </TMenu>
    </div>
    <div v-if="name">
      <router-link class="hover:underline" :to="`/u/${profile.username}`">
        {{ profile.username }}
      </router-link>
    </div>
  </div>
</template>

<script>
import useProfiles from '~/use/profiles'

export default {
  name: 'TAvatar',
  props: {
    uid: {
      type: String,
      default: ''
    },
    photo: {
      type: Boolean,
      default: false
    },
    name: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'xs'
    }
  },
  setup(props) {
    const { getProfile } = useProfiles()

    const profile = getProfile(props.uid)

    return {
      profile
    }
  }
}
</script>
