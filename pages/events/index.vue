<template>
  <main>
    <THeader :title="$t('events.title')" />

    <div v-if="uid" class="flex items-center space-x-2">
      <TTabs v-model="activeFilter" :tabs="filterOptions" class="flex-grow" />
    </div>

    <div class="flex space-x-2 p-2">
      <TInputPlace v-model="currentCity" clearable />
      <t-rich-select
        v-model="eventType"
        clearable
        hide-search-box
        :options="eventTypeList"
        :placeholder="$t('event.type')"
      />
      <t-rich-select
        v-model="dances"
        clearable
        :options="danceStyles"
        :placeholder="$t('style.label')"
      />
      <div>
        <TButton
          v-if="view === 'list'"
          icon="news"
          type="icon"
          @click="view = 'covers'"
        />
        <TButton
          v-if="view === 'covers'"
          icon="notes"
          type="icon"
          @click="view = 'list'"
        />
      </div>
    </div>

    <div>
      <TLoader v-if="loading" />
      <div v-else-if="!count" class="p-4">
        No events found. Would you like to add one?
      </div>

      <div
        v-if="view === 'covers'"
        class="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <router-link
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.id}`"
          class="hover:opacity-75"
        >
          <TSharePreviewPost
            :username="event.organiser"
            collection="events"
            :title="event.name"
            :type="event.type"
            :description="getEventDescription(event)"
            :extra="event.price"
            :photo="event.cover"
            :styles="event.styles"
            size="sm"
          />
        </router-link>
      </div>

      <div v-else>
        <div v-for="(items, date) in itemsByDate" :key="date" class="mb-8">
          <h2 class="font-bold bg-dark text-white py-2 px-4">
            {{ getDay(date) }}, {{ getDate(date) }}
          </h2>
          <div v-for="item in items" :key="item.id" class="px-4 mt-4">
            <TEventText :item="item" />
          </div>
        </div>
      </div>

      <WTeaser
        v-if="!uid"
        :title="$t('teaser.allevents.title')"
        :description="$t('teaser.allevents.description')"
        :button="$t('teaser.allevents.btn')"
        url="/register"
        class="mt-4"
      />
    </div>
  </main>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { startOfWeek, addDays, endOfYear } from 'date-fns'
import { useRsvp } from '~/use/rsvp'
import { useCollection } from '~/use/collection'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { useProfiles } from '~/use/profiles'
import { useEvents } from '~/use/events'
import { useStyles } from '~/use/styles'

import {
  dateDiff,
  sortBy,
  getDate,
  getDay,
  getYmd,
  getEventDescription,
  getDateObect
} from '~/utils'

export default {
  name: 'EventsIndex',
  setup() {
    const { eventTypeList } = useEvents()
    const { getCount, getRsvpResponse, loading: loadingRsvps } = useRsvp()
    const { currentCity } = useCities()
    const { docs, loading: loadingPosts, getById } = useCollection('events')
    const { getProfile } = useProfiles()
    const { getStylesDropdown } = useStyles()

    const eventType = ref('')

    const view = ref('covers')
    const viewOptions = [
      {
        value: 'covers',
        label: 'Grid View'
      },
      {
        value: 'text',
        label: 'Calendar'
      }
    ]

    const { uid, profile: myProfile } = useAuth()
    const dances = ref('')
    const danceStyles = computed(() =>
      getStylesDropdown(myProfile.value?.styles)
    )

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
      const startDate = getDateObect(item.startDate)
      const organiser = getProfile(item.createdBy).username

      return {
        ...item,
        startDate,
        upVotes,
        downVotes,
        votes,
        response,
        order,
        organiser
      }
    }

    const now = new Date()
    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 })
    const startOfWeekString = getYmd(startOfWeekDate)
    const startOfTodayString = getYmd(now)
    const endOfWeekString = getYmd(addDays(startOfWeekDate, 7))
    const endOfYearString = getYmd(endOfYear(now))

    const count = computed(() => items.value.length)
    const { route } = useRouter()

    const loading = computed(() => loadingRsvps.value || loadingPosts.value)

    const activeFilter = ref('thisYear')

    const isPublic = (item) => item.visibility !== 'Unlisted'

    const filterOptions = computed(() => [
      {
        value: 'thisYear',
        label: 'This Year',
        filter: (item) =>
          getYmd(item.startDate) >= startOfTodayString &&
          getYmd(item.startDate) <= endOfYearString &&
          isPublic(item)
      },
      {
        value: 'createdByMe',
        label: 'Created by me',
        filter: (item) => item.createdBy === uid.value
      },
      {
        value: 'schedule',
        label: 'My schedule',
        filter: (item) =>
          item.response === 'up' && getYmd(item.startDate) >= startOfWeekString
      }
    ])

    const activeFilterItem = computed(() =>
      filterOptions.value.find((item) => item.value === activeFilter.value)
    )

    const thisCityFilter = (item) =>
      item.place && currentCity.value ? item.place === currentCity.value : true

    const items = computed(() => {
      let result = docs.value.map(map)

      if (dances.value) {
        result = result.filter(
          (item) =>
            item.styles &&
            item.styles[dances.value] &&
            item.styles[dances.value].selected
        )
      }

      if (eventType.value) {
        result = result.filter((item) => item.type === eventType.value)
      }

      if (!route.query.all) {
        result = result
          .filter(thisCityFilter)
          .filter(activeFilterItem.value.filter)
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

    return {
      getEventDescription,
      currentCity,
      count,
      events: items,
      itemsByDate,
      getRsvpResponse,
      dateDiff,
      loading,
      getById,
      uid,
      getDay,
      getDate,
      startOfWeekString,
      endOfWeekString,
      activeFilter,
      filterOptions,
      dances,
      view,
      viewOptions,
      eventTypeList,
      eventType,
      danceStyles
    }
  }
}
</script>
