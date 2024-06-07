<template>
  <div v-if="!fallback">
    <div>@{{ username }}</div>
    <slot />
  </div>
  <div v-else class="py-2 border-t  border-gray-200 h-full">
    <div class="flex-row gap-2 flex justify-between items-top m-1 px-2">
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
        <div v-if="profile.role" class="text-xs">
          {{ getLabel(eventRoleOptions, profile.role) }}
        </div>
        <template v-if="!hideRole">
          <div class="text-xs">
            <span v-if="profile.gender === 'Male'">Leader</span>
            <span v-else-if="profile.gender === 'Female'">Follower</span>
            <span v-else>Unknown</span>
          </div>
        </template>
        <TProfileStats :profile="profile" class="pb-1" />
        <div v-show="profile.bio" class="text-xs">
          {{ getExcerpt(profile.bio) }}
        </div>

        <TVenueAmenities
          v-if="showAmenities && profile.amenities"
          :amenities="profile.amenities"
          class="text-xs"
        />
        <div v-if="!hideButtons" class="flex space-x-2 mt-4">
          <slot name="actions">
            <TContactsGrid :profile="profile" />
          </slot>
        </div>
      </div>
      <slot name="right" />
    </div>
    <slot />
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
import { getLabel, getExcerpt } from '~/utils'
import { useEvents } from '~/use/events'

export default {
  setup(props) {
    const { id, doc: loadedProfile, find, sync } = useDoc('profiles')
    const { eventRoleOptions } = useEvents()

    if (!props.noLoad) {
      if (props.fallback?.id) {
        sync(props.fallback.id)
      } else {
        find('username', props.username)
      }
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
    hideButtons: {
      type: Boolean,
      default: false,
    },
    showAmenities: {
      type: Boolean,
      default: false,
    },
    noLoad: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
