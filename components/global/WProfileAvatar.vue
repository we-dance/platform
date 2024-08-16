<template>
  <div v-if="!profile">@{{ username }}</div>
  <div v-else class="flex items-center space-x-1">
    <div v-if="photo">
      <NuxtLink :to="localePath(`/${profile.username}`)">
        <TIcon
          v-if="!profile.photo"
          name="undraw_profile_pic"
          :class="`rounded-full w-${dim} h-${dim}`"
        />
        <img
          v-else
          :class="`rounded-full w-${dim} h-${dim}`"
          :src="profile.photo"
          :alt="`${profile.username} photo`"
        />
      </NuxtLink>
    </div>
    <div v-if="name">
      <NuxtLink
        v-if="profile.username"
        class="hover:underline font-bold"
        :to="localePath(`/${profile.username}`)"
      >
        {{ profile.username }}
      </NuxtLink>
    </div>
    <slot />
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  setup(props) {
    const { doc: profile, find, load } = useDoc('profiles')

    if (props.uid) {
      load(props.uid)
    } else {
      find('username', props.username)
    }

    return {
      profile,
    }
  },
  props: {
    username: {
      type: String,
      default: '',
    },
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
  computed: {
    dim() {
      const sizes = {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 32,
      }

      return sizes[this.size]
    },
  },
}
</script>
