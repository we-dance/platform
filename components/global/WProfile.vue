<template>
  <div
    v-if="!fallback && !exists"
    class="border rounded p-4 text-red-500 flex justify-between"
  >
    <div>Profile {{ username }} not found</div>
    <slot />
  </div>
  <div v-else>
    <div
      class="flex-row gap-2 flex justify-between items-center py-2 m-1 border-t border-gray-200 px-2 h-full"
    >
      <div class="flex-shrink-0 w-12">
        <TProfilePhoto2 size="lg" :src="profile.photo" />
      </div>
      <div class="flex flex-col w-full">
        <NuxtLink :to="`/${profile.username}`" class="font-bold">
          {{ profile.name || profile.username }}
        </NuxtLink>
        <div v-show="profile.role" class="text-xs">
          {{ getLabel(eventRoleOptions, profile.role) }}
        </div>
        <div v-show="profile.bio" class="text-gray-700 text-xs">
          {{ profile.bio }}
        </div>
      </div>
      <slot name="right" />
    </div>
    <slot>
      <TProfileContacts :profile="profile" short />
    </slot>
    <TPreview
      v-if="full && profile.story"
      :content="profile.story"
      class="mt-4"
    />
  </div>
</template>

<script>
import { computed } from 'vue-demi'
import { useDoc } from '~/use/doc'
import { getLabel } from '~/utils'
import { useEvents } from '~/use/events'

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
          role: props?.fallback?.role,
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
    full: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
