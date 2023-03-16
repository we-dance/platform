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
          :to="`/${profile.username}`"
          class="font-bold leading-none mb-1"
        >
          {{ profile.name || profile.username }}
        </NuxtLink>
        <div v-if="profile.role" class="text-xs">
          {{ getLabel(eventRoleOptions, profile.role) }}
        </div>
        <div v-else class="text-xs">
          <span v-if="profile.gender === 'Male'">Leader</span>
          <span v-else>Follower</span>
        </div>
        <div v-show="profile.bio" class="text-gray-700 text-xs">
          {{ getExcerpt(profile.bio) }}
        </div>
        <div class="text-xs text-gray-500">
          {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
          ·
          {{
            $tc('subscribers', subscribersCount, {
              count: subscribersCount,
            })
          }}
        </div>
        <div class="flex space-x-2 mt-4">
          <TReaction
            :label="$t('Subscribe')"
            :toggled-label="$t('Unsubscribe')"
            field="watch"
            icon="BellIcon"
            hide-count
            :item="profile"
            collection="profiles"
          />
          <TProfileContacts :profile="profile" title="Contact" type="simple" />
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
  },
}
</script>
