<template>
  <div class="flex border-b p-4 leading-none gap-2">
    <div v-if="showDate" class="text-center">
      <div class="text-xl font-bold leading-none">
        {{ formatDate(startDate, 'd') }}
      </div>
      <div class="w-12 text-sm">
        {{ formatDate(startDate, 'MMM') }}
      </div>
      <div class="w-12 text-xs">
        {{ formatDate(startDate, 'yyyy') }}
      </div>
    </div>
    <div v-else class="text-center">
      <div class="font-bold text-sm leading-none">
        <div>{{ formatDate(startDate, 'HH:mm') }}</div>
      </div>
      <TEventBookmark :event-id="id" :event="item" class="mt-2" />
    </div>
    <div class="w-full">
      <div class="font-bold text-sm leading-none">
        <NuxtLink
          :to="localePath(`/events/${id}`)"
          class="hover:underline hover:text-primary"
          :target="isEmbed ? '_blank' : '_self'"
        >
          {{ name }}
        </NuxtLink>
      </div>
      <div>
        <div class="text-xs pt-1 leading-none">
          <template v-if="role">{{ role }} · </template>
          {{ organiser }}
          <template v-if="venue"> · {{ venue }} </template>
        </div>
      </div>
      <div class="text-xs text-gray-700 pt-1">
        <span class="text-primary">{{ getEventTypeLabel(eventType) }}</span>
        ·
        {{
          getStyles(styles, 0, false, 3)
            .map((s) => s.name)
            .join(' · ')
        }}
      </div>
      <div class="text-xs text-gray-700">
        {{ price }}
      </div>
    </div>
    <div>
      <NuxtLink
        v-if="cover"
        :to="localePath(`/events/${id}`)"
        :target="isEmbed ? '_blank' : '_self'"
        ><img class="w-20 rounded" :src="cover" :alt="`${name} cover`"
      /></NuxtLink>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils'
import { useEvents } from '~/use/events'
import { useStyles } from '~/use/styles'

export default {
  name: 'TEventText',
  setup() {
    const { getEventTypeLabel } = useEvents()
    const { getStyles } = useStyles()

    return {
      formatDate,
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
    id: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '',
    },
    eventType: {
      type: String,
      default: '',
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    organiser: {
      type: String,
      default: '',
    },
  },
}
</script>
