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
      <TEventBookmark :event-id="item.id" :event="item" class="mt-2" />
    </div>
    <div class="w-full">
      <div
        class="font-bold text-sm leading-none hover:underline hover:text-primary"
      >
        <NuxtLink
          :to="item.id ? localePath(`/events/${item.id}?r=${invitedBy}`) : '#'"
          :target="isEmbed ? '_blank' : '_self'"
        >
          {{ item.name || item.id }}
        </NuxtLink>
      </div>
      <div>
        <div class="text-xs pt-1 leading-none">
          <template v-if="item.role">{{ item.role }} · </template>
          {{ item.org ? item.org.username : '' }}
          <template v-if="item.online === 'Yes'">
            · Online
          </template>
          <template v-if="item.venue"> · {{ item.venue.name }}</template>
          <template v-if="item.room"> · {{ item.room }}</template>
        </div>
      </div>
      <div
        v-if="item.eventType || item.styles"
        class="text-xs text-gray-700 pt-1"
      >
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
      <div v-if="item.viewsCount" class="text-xs text-gray-700">
        <template v-if="!item.link"
          >{{ $tc('guests', guestCount, { count: guestCount }) }} ·</template
        >
        {{ $tc('views', item.viewsCount, { count: item.viewsCount }) }} ·
        {{ item.price }}
      </div>
      <slot />
    </div>
    <div>
      <NuxtLink
        v-if="item.cover"
        :to="item.id ? localePath(`/events/${item.id}`) : '#'"
        :target="isEmbed ? '_blank' : '_self'"
      >
        <img
          class="w-20 rounded"
          :src="item.cover"
          :alt="`${item.name} cover`"
        />
      </NuxtLink>
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
  name: 'TEventText2',
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
    invitedBy: {
      type: String,
      default: '',
    },
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
    showRoom: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    guestCount() {
      const guestsCount = this.item.star?.count || 0

      return guestsCount
    },
  },
}
</script>
