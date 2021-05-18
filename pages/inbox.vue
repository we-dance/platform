<template>
  <div>
    <THeader title="Inbox" />
    <TTabs v-model="filter" :tabs="filters" />
    <div class="p-16 text-xs text-center">
      Start conversations and they will appear here.
    </div>
    <div class="font-bold mt-4 p-2 border-b text-xs">
      News since last 7 days
    </div>
    <TPostList :filter="{ place: currentCity }" />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useCities } from '~/use/cities'

export default {
  setup() {
    const { currentCity } = useCities()

    const filter = ref('')
    const filters = [
      {
        label: 'Unread',
        value: 'unread'
      },
      {
        label: 'All',
        value: 'all'
      }
    ]

    return { currentCity, filter, filters }
  }
}
</script>
