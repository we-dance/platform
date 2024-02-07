<template>
  <div>
    <THeader title="Calendars" />    
    <main class="p-4">
      <div class="mb-4">
        <TButton v-if="$route.query.id" type="link" to="/settings/calendars">Back</TButton>
      </div>
      <div
        v-for="calendar in calendars"
        :key="calendar.id"
        class="border p-4 rounded mb-4"
      >
        <h2 class="font-bold">
          <router-link :to="`?id=${calendar.id}`">{{
            calendar.name || '(noname)'
          }}</router-link>
        </h2>
        <p class="text-xs font-bold">{{ calendar.state }}</p>
        <p class="text-xs text-gray-700">{{ calendar.url }}</p>
        <p class="text-xs text-gray-500">
          Last synced:
          {{
            calendar.lastSyncedAt ? getYmdHms(calendar.lastSyncedAt) : 'Never'
          }}
        </p>
        <p class="text-xs text-gray-500">Last count: {{ calendar.lastCount }}</p>
      </div>

      <div v-if="$route.query.id">
        <div v-for="event in events" :key="event.id">
          <TEventImportPreview :item="event" show-date />
        </div>
      </div>
      <div v-else class="flex gap-4">
        <TField
          v-model="newCalendarUrl"
          type="TInput"
          label-position="top"
          label="New Calendar Url"
          placeholder="https://"
        />
        <TButton type="simple" @click="addCalendar">Add</TButton>
      </div>
    </main>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ref, onMounted, computed } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { getYmdHms, sortBy } from '~/utils'

export default {
  computed: {
    events: function () {
      const id = this.$route.query.id

      if (!id) {
        return []
      }

      let calendar = {}      
      calendar = this.calendars.find((calendar) => calendar.id === id)

      return calendar?.events.sort(sortBy('startDate')) || []
    }
  },
  setup() {
    const { uid, profile } = useAuth()

    const calendars = ref([])
    const newCalendarUrl = ref('')
    const firestore = firebase.firestore()

    function addCalendar() {
      const url = newCalendarUrl.value
      newCalendarUrl.value = ''

      firestore.collection('calendars').add({
        url,
        createdAt: +new Date(),
        lastSyncedAt: null,
        userId: uid.value,
        state: 'queued',
        username: profile.value.username,
      })
    }

    onMounted(() => {
      firestore
        .collection('calendars')
        .where('userId', '==', uid.value)
        .onSnapshot((snapshot) => {
          calendars.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        })
    })

    return {
      calendars,
      newCalendarUrl,
      addCalendar,
      getYmdHms
    }
  },
}
</script>
