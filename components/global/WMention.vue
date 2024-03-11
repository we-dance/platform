<template>
  <span v-if="loading">@{{ username }}</span>
  <span v-else-if="!loading && !exists"
    ><a
      :href="`https://instagram.com/${username}`"
      class="inline-flex items-center gap-1"
      ><TIcon name="instagram" size="4" /> {{ username }}</a
    ></span
  >
  <span v-else class="inline-flex items-center gap-1">
    <TProfilePhoto2 size="xs" :src="profile.photo" />
    <NuxtLink :to="localePath(`/${profile.username}`)">
      {{ profile.name || profile.username }}
    </NuxtLink>
  </span>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  setup(props) {
    const { doc: profile, find, exists, loading } = useDoc('profiles')

    find('username', props.username)

    return {
      profile,
      exists,
      loading,
    }
  },
  props: {
    username: {
      type: String,
      default: '',
    },
  },
}
</script>
