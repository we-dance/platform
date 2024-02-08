<template>
  <div class="flex border-b p-4 leading-none gap-2">
    <div class="text-center">
      <div v-if="showDate" class="font-bold text-sm leading-none">
        <div class="text-xl font-bold leading-none text-primary">
          {{ formatDate(item.startDate, 'd') }}
        </div>
        <div>{{ formatDate(item.startDate, 'MMM') }}</div>
        <div class="text-xs">{{ formatDate(item.startDate, 'yyyy') }}</div>
      </div>
      <div v-else class="font-bold text-sm leading-none">
        {{ formatDate(item.startDate, 'HH:mm') }}
      </div>
    </div>
    <div class="w-full">
      <div class="font-bold text-sm leading-none">
        {{ item.name }}
      </div>
      <div>
        <div class="text-xs pt-1 leading-none">
          <template v-if="item.role">{{ item.role }} · </template>
          {{ item.org ? item.org.username : '' }}
          <template v-if="item.online === 'Yes'">
            · Online
          </template>
          <template v-if="item.venue"> · {{ item.venue.name }}</template>
          <template v-if="item.location">{{ item.location }}</template>
        </div>
      </div>
      <div v-if="item.eventType" class="text-xs text-gray-700 pt-1">
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
      <div class="mt-2 flex gap-4 items-center">
        <span
          class="rounded text-xs text-white p-1"
          :class="item.approved ? 'bg-green-500' : 'bg-red-500'"
        >
          {{ item.approved ? 'Approved' : 'Rejected' }}
        </span>
        <router-link
          v-if="item.eventId"
          :to="`/events/${item.eventId}`"
          class="text-xs"
          target="_blank"
          >View Event</router-link
        >
      </div>
    </div>
    <div>
      <img
        v-if="item.cover"
        class="w-20 rounded"
        :src="item.cover"
        :alt="`${item.name} cover`"
      />
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'
import { useApp } from '~/use/app'
import { useEvents } from '~/use/events'
import { useCities } from '~/use/cities'
import { addressPart } from '~/use/google'
import { useStyles } from '~/use/styles'

export default {
  name: 'TEventText',
  setup() {
    const { getCity } = useApp()
    const { currentCity } = useCities()
    const { getEventTypeLabel } = useEvents()
    const { getStyles } = useStyles()

    return {
      formatDate,
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
}
</script>
