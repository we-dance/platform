<template>
  <NuxtLink
    :to="`/events/${item.id}`"
    :target="isEmbed ? '_blank' : '_self'"
    class="flex border-b p-4 leading-none gap-2"
  >
    <div class="text-center">
      <div v-if="showDate" class="font-bold text-sm leading-none">
        <div class="text-xl font-bold leading-none text-primary">
          {{ formatDate(item.startDate, 'd') }}
        </div>
        <div>{{ formatDate(item.startDate, 'MMM') }}</div>
      </div>
      <div v-else class="font-bold text-sm leading-none">
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
          <template v-if="item.role">{{ item.role }} · </template>
          {{ item.org ? item.org.username : '' }}
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
        <span class="text-primary">{{
          getEventTypeLabel(item.eventType)
        }}</span>
        ·
        {{
          getStyles(item.styles, 0, false, 3)
            .map((s) => s.name)
            .join(' · ')
        }}
      </div>
      <div class="text-xs text-gray-700">
        {{ $tc('guests', guestCount, { count: guestCount }) }} ·
        {{ $tc('views', item.viewsCount, { count: item.viewsCount }) }} ·
        {{ item.price }}
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
    const { getEventTypeLabel } = useEvents()
    const { getStyles } = useStyles()

    return {
      formatDate,
      updateRsvp,
      getCity,
      currentCity,
      addressPart,
      getEventTypeLabel,
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
    showDate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    guestCount() {
      const guestsCount = this.item.star?.count || 0
      const artistsCount = this.item.artists?.length || 0

      return guestsCount + artistsCount + 1
    },
  },
}
</script>
