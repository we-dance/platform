<template>
  <pre v-if="$route.query.debug" class="border p-4 m-4 rounded">{{ item }}</pre>
  <div v-else class="rounded bg-white mb-4 shadow border max-w-sm">
    <div>
      <img class="rounded-t" :src="item.cover" :alt="item.name" />
    </div>
    <div class="font-bold leading-tight px-4 my-2">
      {{ item.name }}
    </div>
    <div class="flex justify-between px-4 mb-4 items-center">
      <div>{{ getDateTime(item.startTime) }}</div>
      <TButton :href="item.url">Open</TButton>
    </div>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      getDateTime,
    }
  },
}
</script>
