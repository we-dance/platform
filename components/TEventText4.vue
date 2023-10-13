<template>
  <NuxtLink
    :to="`/events/${id}`"
    :target="isEmbed ? '_blank' : '_self'"
    class="flex border-b p-4 leading-none gap-2"
  >
    <div class="text-center">
      <div class="font-bold text-sm leading-none">
        <div>{{ formatDate(startDate, 'HH:mm') }}</div>
      </div>
    </div>
    <div class="w-full">
      <div
        class="font-bold text-sm leading-none hover:underline hover:text-primary"
      >
        {{ name }}
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
      <img class="w-20 rounded" :src="cover" />
    </div>
  </NuxtLink>
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
