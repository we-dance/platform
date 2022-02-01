<template>
  <div
    v-if="!fallback && !exists"
    class="border rounded p-4 text-red-500 flex justify-between"
  >
    <div>Profile {{ username }} not found</div>
    <slot />
  </div>
  <div
    v-else
    class="flex-row gap-2 flex justify-between items-center py-2 m-1 border-t border-gray-200 px-2 h-full"
  >
    <div class="flex-shrink-0 w-12">
      <TProfilePhoto2 size="lg" :src="profile.photo" />
    </div>
    <div class="flex flex-col w-full">
      <NuxtLink :to="`/${profile.username}`" class="font-bold">
        {{ profile.name || profile.username }}
      </NuxtLink>
      <div v-if="profile.role" class="text-xs">
        {{ getLabel(eventRoleOptions, profile.role) }}
      </div>
      <div v-if="profile.bio" class="text-gray-700 text-xs">
        {{ profile.bio }}
      </div>
    </div>
    <slot>
      <TProfileContacts :profile="profile" short class="flex-shrink-0" />
    </slot>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'
import { getLabel } from '~/utils'
import { useEvents } from '~/use/events'
import { computed } from 'vue-demi'

export default {
  setup(props) {
    const { id, doc: loadedProfile, loading, exists, find } = useDoc('profiles')
    const { eventRoleOptions } = useEvents()

    if (props.username) {
      find('username', props.username)
    }

    const profile = computed(() => {
      if (loadedProfile.value?.username) {
        return {
          ...props.fallback,
          ...loadedProfile.value,
        }
      }

      return props.fallback
    })

    return {
      id,
      eventRoleOptions,
      profile,
      loading,
      exists,
      getLabel,
    }
  },
  props: {
    username: {
      type: String,
      default: '',
    },
    fallback: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
