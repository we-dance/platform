<template>
  <div>
    <THeader :title="$t('settings.calendars.title')" />
    <main class="p-4">
      <div class="mb-4">
        <TButton v-if="$route.query.id" type="link" to="/settings/calendars">{{
          $t('back')
        }}</TButton>
      </div>
      <TLoader v-if="loading" />
      <section v-else>
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
        <div v-else>
          <form
            class="flex flex-col gap-4 p-4 bg-gray-100 border rounded"
            @submit.prevent="addCalendar"
          >
            <TField
              v-model="newCalendarUrl"
              required
              type="url"
              label-position="top"
              :label="$t('settings.calendars.newCalendarUrl.label')"
              :description="$t('settings.calendars.newCalendarUrl.description')"
              placeholder="https://"
            />
            <div class="flex justify-end">
              <TButton xtype="submit" variant="primary">{{
                $t('settings.calendars.submit')
              }}</TButton>
            </div>
          </form>
          <TFaqCalendars class="my-4" :faqs="$t('faqs.calendars')" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { until } from '@vueuse/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ref, onMounted } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { getYmdHms, sortBy } from '~/utils'

export default {
  middleware: 'auth',
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
    const { uid, profile, isAdmin, account } = useAuth()

    const loading = ref(true)
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
      if (!newCalendarUrl.value) {
        return
      }

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

      await until(account).not.toBeNull()

      if (!isAdmin()) {
        collection = collection.where('userId', '==', uid.value)
      }

      collection.orderBy('createdAt', 'asc').onSnapshot((snapshot) => {
        calendars.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        loading.value = false
      })
    })

    return {
      loading,
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
