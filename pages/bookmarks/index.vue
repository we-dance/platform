<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <TwTabs
      :tabs="[{ name: 'Events', to: '#events', current: true }]"
      class="border-b"
    />

    <div id="events">
      <TEventText2
        v-for="event in events"
        :key="event.id"
        :item="event"
        show-date
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { until } from '@vueuse/core'
import { useAuth } from '~/use/auth'
import { db } from '~/plugins/firebase'
import { sortBy } from '~/utils'

export default {
  setup() {
    const { profile } = useAuth()
    const events = ref([])

    onMounted(async () => {
      await until(profile).not.toBeNull()

      let result = []
      for (const eventId of profile.value.bookmarks) {
        const doc = await db
          .collection('posts')
          .doc(eventId)
          .get()

        result.push({
          ...doc.data(),
          id: doc.id,
        })
      }

      result = result.sort(sortBy('startDate'))
      events.value = result
    })

    return {
      events,
      profile,
    }
  },
}
</script>
