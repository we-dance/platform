<template>
  <NuxtLink
    :to="`/events/${item.id}`"
    :target="isEmbed ? '_blank' : '_self'"
    class="flex border-b p-4 leading-none gap-2"
  >
    <div class="text-center">
      <div class="text-xl font-bold leading-none">
        {{ formatDate(item.startDate, 'd') }}
      </div>
      <div class="w-12 text-sm">
        {{ formatDate(item.startDate, 'MMM') }}
      </div>
    </div>
    <div class="w-full">
      <div class="font-bold text-sm hover:underline hover:text-primary">
        {{ item.name }}
      </div>
      <div class="text-sm">
        {{ formatDate(item.startDate, 'iii') }} ·
        {{ formatDate(item.startDate, 'HH:mm') }} ·
        {{ item.eventType }}
      </div>
      <div>
        <div class="text-xs text-gray-700">
          {{ item.org.username }}
          <template v-if="item.online === 'Yes'">
            · Online
          </template>
          <template v-if="item.venue">
            <template v-if="currentCity === item.place">
              · {{ item.venue.name }}
            </template>
            <template v-else>
              · {{ addressPart(item.venue, 'locality') }}
            </template>
          </template>
        </div>
      </div>
    </div>
    <div>
      <img class="w-20 rounded" :src="item.cover" />
    </div>
  </NuxtLink>
</template>

<script>
import { formatDate } from '~/utils'
import { useRsvp } from '~/use/rsvp'
import { useApp } from '~/use/app'
import { useEvents } from '~/use/events'
import { useCities } from '~/use/cities'
import { addressPart } from '~/use/google'

export default {
  name: 'TEventText',
  setup() {
    const { updateRsvp } = useRsvp()
    const { getCity } = useApp()
    const { currentCity } = useCities()
    const { getEventIcon } = useEvents()

    return {
      formatDate,
      updateRsvp,
      getCity,
      currentCity,
      addressPart,
      getEventIcon,
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isEmbed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
