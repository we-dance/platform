<template>
  <div class="flex">
    <div>
      <div>
        <div class="text-primary text-sm">
          {{ getTime(item.startDate) }}–{{ getTime(item.endDate) }}
        </div>
        <div class="font-bold leading-none">
          {{ item.name }}
        </div>
      </div>
      <div>
        <div class="text-xs">
          <span>{{ item.eventType }}</span>
          <span v-for="artist in item.artists" :key="artist.username">
            <span class="w-2 text-center">·</span>
            <router-link
              :to="`/${artist.username}`"
              class="text-primary hover:underline"
              >{{ artist.username }}</router-link
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTime } from '~/utils'
import { useEvents } from '~/use/events'

export default {
  name: 'TAgendaItem',
  setup() {
    const { getEventIcon } = useEvents()

    return {
      getTime,
      getEventIcon,
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
