<template>
  <NuxtLink
    :to="`/events/${item.id}`"
    :target="isEmbed ? '_blank' : '_self'"
    class="flex border-b p-4 leading-none gap-2"
  >
    <div class="text-center">
      <div class="font-bold text-sm leading-none">
        {{ formatDate(item.startDate, 'HH:mm') }}
      </div>
    </div>
    <div class="w-full">
      <div
        class="font-bold text-sm leading-none hover:underline hover:text-primary"
      >
        {{ item.name }}
      </div>
      <div>
        <div class="text-xs pt-1 leading-none">
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
      <div class="text-xs text-gray-700 pt-1">
        <span class="text-primary">{{ item.eventType }}</span> ·
        {{
          getStyles(item.styles, 0, false, 3)
            .map((s) => s.name)
            .join(' · ')
        }}
      </div>
      <div class="text-xs text-gray-500 pt-1">
        {{ item.viewsCount || 0 }} views
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
import { useStyles } from '~/use/styles'

export default {
  name: 'TEventText',
  setup() {
    const { updateRsvp } = useRsvp()
    const { getCity } = useApp()
    const { currentCity } = useCities()
    const { getEventIcon } = useEvents()
    const { getStyles } = useStyles()

    return {
      formatDate,
      updateRsvp,
      getCity,
      currentCity,
      addressPart,
      getEventIcon,
      getStyles,
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
