<template>
  <div
    v-if="!fallback"
    class="border rounded p-4 text-red-500 flex justify-between"
  >
    <div>Profile {{ username }} not found</div>
    <slot />
  </div>
  <div v-else>
    <div
      class="flex-row gap-2 flex justify-between items-top py-2 m-1 border-t border-gray-200 px-2 h-full"
    >
      <div class="flex-shrink-0 w-12">
        <TProfilePhoto2 size="lg" :src="profile.photo" />
      </div>
      <div class="flex flex-col w-full">
        <NuxtLink
          :to="localePath(`/${profile.username}`)"
          class="font-bold leading-none mb-1"
        >
          {{ profile.name || profile.username }}
        </NuxtLink>
        <template v-if="!hideRole">
          <div v-if="profile.role" class="text-xs">
            {{ getLabel(eventRoleOptions, profile.role) }}
          </div>
          <div v-else class="text-xs">
            <span v-if="profile.gender === 'Male'">Leader</span>
            <span v-else-if="profile.gender === 'Female'">Follower</span>
            <span v-else>Unknown</span>
          </div>
        </template>
        <div v-show="profile.bio" class="text-gray-700 text-xs">
          <span class="font-bold">About me:</span> {{ profile.bio }}
        </div>
        <div v-show="profile.partnerBio" class="text-gray-700 text-xs">
          <span class="font-bold">Looking for:</span>
          {{ profile.partnerBio }}
        </div>
        <div class="flex space-x-2 mt-4">
          <TButton>Select</TButton>
        </div>
      </div>
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue-demi'
import { useDoc } from '~/use/doc'
import { getLabel, getExcerpt } from '~/utils'
import { useEvents } from '~/use/events'

export default {
  setup(props) {
    const { id, doc: loadedProfile, find, sync } = useDoc('profiles')
    const { eventRoleOptions } = useEvents()

    if (props.fallback?.id) {
      sync(props.fallback.id)
    } else {
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

    const subscribersCount = computed(() => {
      return profile.value?.watch?.count || 0
    })

    return {
      id,
      eventRoleOptions,
      profile,
      getLabel,
      getExcerpt,
      subscribersCount,
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
    hideRole: {
      type: Boolean,
      default: false,
    },
  },
}
</script>