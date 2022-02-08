<template>
  <pre v-if="$route.query.debug" class="m-4 rounded border p-4">{{ item }}</pre>
  <div v-else class="mb-4 max-w-sm rounded border bg-white shadow">
    <div>
      <img class="rounded-t" :src="item.cover" :alt="item.name" />
    </div>
    <div class="my-2 px-4 font-bold leading-tight">
      {{ item.name }}
    </div>
    <div class="mb-4 flex items-center justify-between px-4">
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
