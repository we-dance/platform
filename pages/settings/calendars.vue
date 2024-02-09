<template>
  <div>
    <THeader title="Calendars" />
    <main class="p-4">
      <div class="mb-4">
        <TButton v-if="$route.query.id" type="link" to="/settings/calendars"
          >Back</TButton
        >
      </div>
      <div
        v-for="calendar in calendars"
        v-show="!$route.query.id || $route.query.id === calendar.id"
        :key="calendar.id"
        class="border p-4 rounded mb-4"
      >
        <div class="flex justify-between gap-4">
          <div>
            <h2 class="font-bold">
              <router-link :to="`?id=${calendar.id}`">{{
                calendar.name || '(noname)'
              }}</router-link>
            </h2>
            <p class="text-xs font-bold">{{ calendar.state }}</p>
          </div>
          <div>
            <TDropdown>
              <TButton
                icon="upload"
                label="Sync"
                type="context"
                @click="refresh(calendar.id)"
              />
              <TButton
                icon="delete"
                label="Remove"
                type="context"
                @click="remove(calendar.id)"
              />
            </TDropdown>
          </div>
        </div>

        <div class="text-xs text-gray-700">
          <span>{{ calendar.username }}</span> •
          <a class="underline" :href="calendar.url" target="_blank">ical</a>
        </div>
        <p class="text-xs text-gray-500">
          Last synced:
          {{
            calendar.lastSyncedAt ? getYmdHms(calendar.lastSyncedAt) : 'Never'
          }}
        </p>
        <p class="text-xs text-gray-500">
          New: {{ calendar.newCount }} • Upcoming:
          {{ calendar.approvedCount }} of {{ calendar.upcomingCount }} • Past:
          {{ calendar.pastCount }}
        </p>
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
import { ref, onMounted } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { getYmdHms, sortBy } from '~/utils'
import { until } from '@vueuse/core'

export default {
  computed: {
    events() {
      const id = this.$route.query.id

      if (!id) {
        return []
      }

      let calendar = {}
      calendar = this.calendars.find((calendar) => calendar.id === id)

      return calendar?.events?.sort(sortBy('startDate')) || []
    },
  },
  setup() {
    const { uid, profile, isAdmin, loading } = useAuth()

    const calendars = ref([])
    const newCalendarUrl = ref('')
    const firestore = firebase.firestore()

    function refresh(id) {
      firestore
        .collection('calendars')
        .doc(id)
        .update({
          state: 'queued',
        })
    }

    function remove(id) {
      firestore
        .collection('calendars')
        .doc(id)
        .delete()
    }

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

    onMounted(async () => {
      let collection = firestore.collection('calendars')

      await until(uid).not.toBeNull()

      if (!isAdmin()) {
        collection = collection.where('userId', '==', uid.value)
      }

      collection.orderBy('createdAt', 'asc').onSnapshot((snapshot) => {
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
      getYmdHms,
      refresh,
      remove,
    }
  },
}
</script>
