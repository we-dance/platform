<template>
  <div v-if="loading" class="border rounded p-4">
    Loading profile {{ username }}
  </div>
  <div v-else-if="!exists" class="border rounded p-4 text-red-500">
    Profile {{ username }} not found
  </div>
  <router-link
    v-else
    :to="`/${profile.username}`"
    class="rounded border hover:border-black shadow p-4 bg-dark-gradient text-sm flex items-start justify-start flex-grow my-2 no-underline"
  >
    <TProfilePhoto size="xl" :uid="id" />
    <div class="flex-grow ml-4">
      <div class="font-bold text-white text-xl leading-none">
        {{ profile.name }}
      </div>
      <div class="text-gray-300 text-xs">@{{ profile.username }}</div>
      <div class="mt-2 text-white">{{ profile.bio }}</div>
    </div>
  </router-link>
</template>

<script>
import { useDoc } from '~/use/doc'

export default {
  setup(props) {
    const { id, doc: profile, loading, exists, find } = useDoc('profiles')
    find('username', props.username)

    return {
      id,
      profile,
      loading,
      exists,
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
