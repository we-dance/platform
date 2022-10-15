<template>
  <div>
    <div v-if="events.length" class="flex justify-between items-center">
      <h2 v-if="title" class="font-bold text-xl">{{ title }}</h2>
    </div>
    <div v-for="event in events" :key="event.id" class="px-4 mt-4">
      <TAgendaItem :item="event" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Program',
    },
    events: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
