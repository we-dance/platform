<template>
  <div class="flex">
    <div v-if="false" class="mr-2 flex justify-center items-start pt-1">
      <button
        v-if="item.response === 'up'"
        class="text-green-500"
        @click="updateRsvp(item.id, 'events', 'down')"
      >
        <TIcon name="check_circle" class="w-4 h-4" />
      </button>
      <button v-else @click="updateRsvp(item.id, 'events', 'up')">
        <TIcon name="check" class="w-4 h-4" />
      </button>
    </div>
    <div class="mr-2">
      {{ getTime(item.startDate) }}
    </div>
    <div class="mr-2">
      {{ item.type === 'Party' ? '🎉' : '👣' }}
    </div>
    <div>
      <router-link
        :to="`/events/${item.id}`"
        class="font-bold leading-none hover:underline hover:text-primary"
      >
        {{ item.name }}
      </router-link>
      <div class="text-xs flex flex-wrap">
        <div class="flex items-center mr-2">
          <TIcon name="icon" class="w-4 h-4 mr-1" />
          <TAvatar class="mr-2" name :uid="item.createdBy" />
        </div>
        <div v-if="item.address">
          <div class="flex items-center">
            <TIcon name="place" class="w-4 h-4 mr-1" />
            <p>
              {{ item.address }}
              <span v-if="item.place">• {{ getCity(item.place) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTime } from '~/utils'
import useRSVP from '~/use/rsvp'
import { useApp } from '~/use/app'

export default {
  name: 'TEventText',
  setup() {
    const { updateRsvp } = useRSVP()
    const { getCity } = useApp()

    return {
      getTime,
      updateRsvp,
      getCity
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
