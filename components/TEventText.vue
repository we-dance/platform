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
      {{ getEventIcon(item.type) }}
    </div>
    <div>
      <router-link
        :to="`/events/${item.id}`"
        class="font-bold leading-none hover:underline hover:text-primary"
      >
        {{ item.name }}
      </router-link>
      <div class="text-xs flex flex-wrap gap-1">
        <div v-if="item.online === 'Yes'">
          <div class="flex items-center gap-1">
            <TIcon name="youtube" class="w-4 h-4" />
            <p>
              Online
            </p>
          </div>
        </div>
        <div v-if="item.venue" class="flex items-center gap-1">
          <template v-if="currentCity === item.place">
            <TIcon name="place" class="w-4 h-4" />
            <p>
              {{ item.venue.name }}
            </p>
          </template>
          <template v-else>
            <TIcon name="car" class="w-4 h-4" />
            <p>
              {{ addressPart(item.venue, 'locality') }}
            </p>
          </template>
        </div>
      </div>
      <div class="text-xs flex flex-wrap gap-1">
        <div v-if="item.price">
          <div class="flex items-center gap-1">
            <TIcon name="ticket" class="w-4 h-4" />
            <div>
              <small class="font-serif font-medium">&#9660; Min</small>
              {{ getPrice.min(item.price) }}
            </div>
          </div>
          <div class="flex items-center gap-1">
            <TIcon name="ticket" class="w-4 h-4" />
            <div>
              <small class="font-serif font-medium">&#9650; Max</small>
              {{ getPrice.max(item.price) }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <TIcon name="lobby" class="w-4 h-4" />
          <div v-if="item.claimed === 'Yes'">
            Organised by
          </div>
          <div v-else>
            Promoted by
          </div>
          <TAvatar name :uid="item.createdBy" class="text-primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTime, getPrice } from '~/utils'
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
    const { getEventIcon } = useEvents()
    const { currentCity } = useCities()

    return {
      getTime,
      updateRsvp,
      getCity,
      currentCity,
      addressPart,
      getEventIcon,
      getPrice,
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
