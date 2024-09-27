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
        <div v-if="!hideType && profile.role" class="text-xs">
          {{ getLabel(eventRoleOptions, profile.role) }}
        </div>
        <template v-if="!hideRole">
          <div class="text-xs">
            <span v-if="profile.gender === 'Male'">Leader</span>
            <span v-else-if="profile.gender === 'Female'">Follower</span>
            <span v-else>Unknown</span>
          </div>
        </template>
        <TProfileStats
          :profile="profile"
          :hide-type="hideType"
          :hide-views="hideViews"
          class="pb-1"
        />
        <div v-show="!hideBio && profile.bio" class="text-xs">
          {{ getExcerpt(profile.bio) }}
        </div>

        <TVenueAmenities
          v-if="showAmenities && profile.amenities"
          :amenities="profile.amenities"
          wrapper-class="text-xs flex flex-wrap gap-1 mt-2"
          item-class="rounded-full bg-orange-100 px-1 block"
        />
        <div v-if="!hideButtons" class="mt-4">
          <div class="flex gap-2">
            <TReaction
              :label="$t('Subscribe')"
              :toggled-label="$t('Subscribed')"
              toggled-class="bg-green-500"
              field="watch"
              type="primary"
              hide-count
              :item="profile"
              title="subscribe"
              collection="profiles"
            />
            <TButton
              type="secondary"
              icon="star"
              :to="`/reviews/add?receiver=${profile.username}`"
              label="Rate"
              title="rate"
              :track="{ event: 'rate' }"
            />
          </div>

          <div class="flex space-x-2 mt-4 items-center">
            <slot name="actions">
              <TContactsGrid :profile="profile" />
            </slot>
          </div>
        </div>
      </div>
      <slot name="right">
        <div>
          <TReaction
            v-if="subscribeRight"
            field="watch"
            type="secondary"
            hide-count
            title="subscribe"
            icon="BellIcon"
            toggled-icon="CheckIcon"
            :item="profile"
            collection="profiles"
          />
        </div>
      </slot>
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
    hideType: {
      type: Boolean,
      default: false,
    },
    hideViews: {
      type: Boolean,
      default: false,
    },
    hideBio: {
      type: Boolean,
      default: false,
    },
    subscribeRight: {
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
