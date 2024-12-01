<script>
import { ref, onMounted, computed } from 'vue-demi'
import { getEventsOrganisedBy } from '~/use/events'
import { useRouter } from '~/use/router'
import { getTime, getShortDate, sortBy } from '~/utils'

export default {
  layout: 'empty',
  setup() {
    const events = ref([])

    const selectedProduct = ref(1)
    const currentProduct = computed(() =>
      products.value.find((p) => p.id === selectedProduct.value)
    )
    const products = computed(() => {
      return [
        {
          id: 1,
          name: 'Salsa Intermediate',
          events: events.value.filter((e) =>
            [
              'EXwNJ08h1NFneNLhtUPC',
              'r77PixjnFE0S6veCfmPI',
              'yPbIOBMrhQPG38nSWkN0',
              'QV7ohxgjySMqb1KzwdIq',
              'kSgoKvsnPopadRCF19f0',
              'z92O5h2CWlNoWityyqrj',
              'QnEzAyJa0gtHbcyKGmr6',
              'mih1xYFs59BcnW4pzwfP',
              'EaeoFUwEvwj3jyQGLBDX',
            ].includes(e.id)
          ),
        },
        {
          id: 2,
          name: 'Salsa From Zero',
          events: events.value.filter((e) =>
            [
              'i4nUe9SoyRVIjZNnpFes',
              'FDu58Lo8cvsCC519Q8QT',
              'qDZVoxLyqmKrdaxep1LR',
              'rFvj5DcQjPTyx0XJyBzF',
              'jYri4bjeo66QUKqHHfoK',
              'UeTwwgnYsh8NPlohpqrE',
              'S6pX7f0jC79Keh5W9ubh',
              's9DMsUY4Nt3Q6jzqelrw',
              'pWHJ5rdAfScZo5vYrhwH',
            ].includes(e.id)
          ),
        },
        {
          id: 3,
          name: 'Kizomba From Zero',
          events: events.value.filter((e) =>
            [
              'Nkc0tpTaW0g3E8gwRoiL',
              'AEba8NV6xICC8Mp9gAjF',
              '2c2ucbWE1qIGtKC8GRU1',
              'OB8ulU2kT5t0E9disGtH',
            ].includes(e.id)
          ),
        },
      ]
    })

    const students = computed(() => {
      const studentMap = new Map()

      for (const event of currentProduct.value.events) {
        for (const guest of event.guests) {
          if (!studentMap.has(guest)) {
            studentMap.set(guest, [])
          }
          studentMap.get(guest).push({
            id: event.id,
            name: event.name,
            date: event.date,
            time: event.time,
            startDate: event.startDate,
          })
        }
      }

      return Array.from(studentMap)
        .map(([username, events]) => ({
          username,
          eventsCount: events.length,
          latestEventDate: Math.max(...events.map((e) => e.startDate)),
          events,
        }))
        .sort((a, b) => {
          if (b.latestEventDate !== a.latestEventDate) {
            return b.latestEventDate - a.latestEventDate
          }
          return b.eventsCount - a.eventsCount
        })
    })
    const { route } = useRouter()
    const username = route.query.username

    async function loadEvents() {
      if (!username) {
        return
      }

      let result = []

      result = [...(await getEventsOrganisedBy(username))]

      events.value = result
        .map((e) => ({
          ...e,
          startDate: +new Date(e.startDate),
          date: getShortDate(e.startDate),
          time: getTime(e.startDate),
          guests: e.star?.usernames || [],
        }))
        .sort(sortBy('-startDate'))
    }

    onMounted(loadEvents)

    return {
      username,
      events,
      students,
      currentProduct,
      products,
      selectedProduct,
    }
  },
}
</script>
<template>
  <div class="p-4">
    <select
      v-model="selectedProduct"
      class="mb-4 p-2 border border-gray-300 rounded"
    >
      <option
        v-for="product in products"
        :key="product.name"
        :value="product.id"
      >
        {{ product.name }}
      </option>
    </select>
    <table class="border-collapse border border-gray-300">
      <thead>
        <tr>
          <th class="border border-gray-300 px-4 py-2 w-40">Student</th>
          <th
            v-for="event in currentProduct.events"
            :key="event.id"
            class="border border-gray-300 px-4 py-2 w-20"
          >
            {{ event.date }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.username">
          <td class="border border-gray-300 px-4 py-2">
            {{ student.username }}
          </td>
          <td
            v-for="event in currentProduct.events"
            :key="event.id"
            class="border border-gray-300 px-4 py-2 text-center w-20"
          >
            {{ student.events.some((e) => e.id === event.id) ? '✓' : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
