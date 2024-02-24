<template>
  <div v-if="!profile">
    <div>{{ username }}</div>
  </div>
  <div v-else>
    <div class="flex-col gap-2 flex justify-center items-center px-2">
      <div class="flex flex-col w-full">
        <NuxtLink
          :to="localePath(`/${profile.username}`)"
          class="leading-none mb-1"
        >
          {{ profile.name || profile.username }}
        </NuxtLink>
      </div>
      <div class="flex-shrink-0 w-12">
        <TProfilePhoto2 size="lg" :src="profile.photo" />
      </div>
    </div>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  setup(props) {
    const { doc: profile, find } = useDoc('profiles')

    find('username', props.username)

    return {
      profile,
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
