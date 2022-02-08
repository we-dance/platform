<template>
  <div v-if="showEditor" class="border p-4">
    <TForm v-model="data" :fields="fields" class="space-y-2" @save="saveNode" />
  </div>
  <div v-else class="flex space-x-4 border p-4">
    <div class="flex-grow">
      <NuxtLink
        :to="`/events/${node.id}`"
        class="font-bold leading-none underline hover:no-underline"
        >{{ node.name }}</NuxtLink
      >
      <div class="mt-2 text-sm text-gray-700 space-y-1">
        <div class="flex gap-2 items-center">
          <CalendarIcon class="w-4 h-4" />
          <TDateTime :value="node.startDate" />
        </div>
        <div class="flex gap-2 items-center">
          <LocationMarkerIcon class="w-4 h-4" />
          <TVenue :node="node.venue" />
        </div>
        <div v-if="node.price" class="flex gap-2 items-center">
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
import { computed, onMounted, ref } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useEvents } from '~/use/events'
import { useDoc } from '~/use/doc'

export default {
  components: {
    LocationMarkerIcon,
    CalendarIcon,
    TicketIcon,
  },
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
  methods: {
    saveNode(data) {
      this.update(this.node.id, data)
    },
  },
  setup(props) {
    const { can } = useAuth()
    const { update } = useDoc('posts')
    const data = ref({})
    const { eventFields } = useEvents()

    onMounted(() => {
      data.value = {
        startDate: props.node.startDate,
        venue: props.node.venue,
        duration: props.node.duration || 60,
        name: props.node.name || 'Meetup',
      }
    })

    const showEditor = computed(() => {
      if (!props.node) {
        return false
      }

      return can('edit', 'posts', props.node) && !props.node.name
    })

    const fields = eventFields.filter((f) => f.simple)

    return { showEditor, fields, update, data }
  },
}
</script>
