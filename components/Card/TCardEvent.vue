<template>
  <div class="flex space-x-4 border p-4">
    <div class="flex-grow">
      <h4 class="font-bold leading-none">{{ node.name }}</h4>
      <div class="mt-2 text-sm text-gray-700 space-y-1">
        <div class="flex gap-2 items-center">
          <CalendarIcon class="w-4 h-4" />
          <TDateTime :value="node.startDate" />
        </div>
        <div class="flex gap-2 items-center">
          <LocationMarkerIcon class="w-4 h-4" />
          <TVenue :node="node.venue" />
        </div>
        <div class="flex gap-2 items-center">
          <TicketIcon class="w-4 h-4" />
          {{ node.price }}
        </div>
        <TStyles :value="node.styles" />
      </div>
    </div>
    <div v-if="showCover" class="aspect-square">
      <img :src="node.cover" class="w-20" />
    </div>
  </div>
</template>

<script>
import {
  LocationMarkerIcon,
  CalendarIcon,
  TicketIcon,
} from '@vue-hero-icons/outline'

export default {
  props: {
    node: {
      type: Object,
      required: true,
    },
    showCover: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LocationMarkerIcon,
    CalendarIcon,
    TicketIcon,
  },
}
</script>
