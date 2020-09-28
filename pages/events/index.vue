<template>
  <main>
    <TTitle>
      Events
    </TTitle>

    <div>
      <TLoader v-if="loading" />
      <div v-else-if="!count">
        No events found
      </div>
      <div v-for="(items, date) in itemsByDate" :key="date" class="mb-8">
        <h2 class="font-bold bg-dark text-white py-2 px-4 rounded">
          {{ getDay(date) }}, {{ getDate(date) }}
        </h2>
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-white px-4 mt-4 flex"
        >
          <div v-if="false" class="mr-2 flex justify-center items-start pt-1">
            <button
              v-if="item.response === 'up'"
              class="text-green-500"
              @click="updateRsvp(item.id, 'events', 'down')"
            >
              <TIcon name="check_circle" class="w-4 h-4" />
            </button>
            <button v-else @click="updateRsvp(item.id, 'events', 'up')">
              <TIcon name="check" class="w-4 h-4" />
            </button>
          </div>
          <div class="mr-2">
            {{ getTime(item.startDate) }}
          </div>
          <div class="mr-2">
            {{ item.type === 'Party' ? '🎉' : '👣' }}
          </div>
          <div>
            <router-link
              :to="`/events/${item.id}`"
              class="font-bold leading-tight underline hover:no-underline"
            >
              {{ item.name }}
            </router-link>
            <div class="flex text-xs">
              <div v-if="item.organiser">
                <div class="flex items-center">
                  <TIcon name="store" class="w-4 h-4 mr-1" />
                  <p>
                    {{ item.organiser }}
                  </p>
                </div>
              </div>
              <div v-if="item.address" class="ml-2">
                <div class="flex items-center">
                  <TIcon name="place" class="w-4 h-4 mr-1" />
                  <p>
                    {{ item.address }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { startOfWeek, addDays } from 'date-fns'
import useRSVP from '~/use/rsvp'
import useCollection from '~/use/collection'
import useAccounts from '~/use/accounts'
import useAuth from '~/use/auth'
import useCities from '~/use/cities'
import useRouter from '~/use/router'
import { dateDiff, sortBy, getTime, getDate, getDay, getYmd } from '~/utils'

export default {
  name: 'EventsIndex',
  setup() {
    const {
      getCount,
      getRsvpResponse,
      updateRsvp,
      loading: loadingRsvps
    } = useRSVP()
    const { currentCity } = useCities()
    const { docs, loading: loadingPosts, getById } = useCollection('events')

    const { uid } = useAuth()

    const map = (item) => {
      if (!item.id) {
        return {}
      }

      const upVotes = getCount(item.id, 'up')
      const downVotes = getCount(item.id, 'down')
      const votes = upVotes - downVotes
      const response = getRsvpResponse(item.id)
      const multi = !response ? 3 : response === 'up' ? 2 : 1
      const order = multi * 100 + votes

      return {
        ...item,
        upVotes,
        downVotes,
        votes,
        response,
        order
      }
    }

    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 })
    const startOfWeekString = getYmd(startOfWeekDate)
    const endOfWeekString = getYmd(addDays(startOfWeekDate, 7))

    const thisWeekFilter = (item) =>
      getYmd(item.startDate) >= startOfWeekString &&
      getYmd(item.startDate) <= endOfWeekString &&
      item.city === currentCity.value

    const count = computed(() => items.value.length)
    const { route } = useRouter()

    const items = computed(() => {
      let result = docs.value.map(map)

      if (!route.query.all) {
        result = result.filter(thisWeekFilter)
      }

      return result.sort(sortBy('startDate'))
    })

    const itemsByDate = computed(() => {
      const result = {}
      items.value.forEach((item) => {
        const date = getYmd(item.startDate)

        result[date] = result[date] || []
        result[date].push(item)
      })

      return result
    })

    const loading = computed(() => loadingRsvps.value && loadingPosts.value)

    const { getAccount } = useAccounts()

    return {
      currentCity,
      count,
      itemsByDate,
      getRsvpResponse,
      updateRsvp,
      dateDiff,
      getAccount,
      loading,
      getById,
      uid,
      getTime,
      getDay,
      getDate,
      startOfWeekString,
      endOfWeekString
    }
  }
}
</script>
