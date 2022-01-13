<template>
  <main>
    <THeader :title="$t('events.title')">
      <TButton type="nav" icon="plus" to="/events/-/edit" />
    </THeader>

    <div class="flex space-x-2 p-2">
      <t-rich-select
        v-model="eventType"
        clearable
        hide-search-box
        :options="eventTypeListIcons"
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
          :label="$t('events.photos.label')"
          @click="view = 'covers'"
        />
        <TButton
          v-if="view === 'covers'"
          icon="notes"
          type="icon"
          :label="$t('events.list.label')"
          @click="view = 'list'"
        />
      </div>
    </div>

    <div>
      <TLoader v-if="loading" />
      <div v-else-if="!count" class="p-4">
        {{ $t('events.list.empty') }}
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
            :extra="event.locality"
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

      <WTeaser
        v-if="uid"
        :title="$t('teaser.chat.title')"
        :description="$t('teaser.chat.description')"
        :button="$t('teaser.chat.btn', { city: 'Community' })"
        href="https://t.me/joinchat/Vxw15sDG-dWpqHDj"
        class="mt-4"
      />
    </div>
  </main>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { startOfWeek, addDays, endOfYear } from 'date-fns'
import { useCollection } from '~/use/collection'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { useProfiles } from '~/use/profiles'
import { eventTypeListIcons } from '~/use/events'
import { useStyles } from '~/use/styles'
import { addressPart } from '~/use/google'

import {
  dateDiff,
  sortBy,
  getDate,
  getDay,
  getYmd,
  getEventDescription,
  getDateObect,
} from '~/utils'

export default {
  name: 'EventsIndex',
  setup() {
    const { currentCity } = useCities()
    const { docs, loading: loadingPosts, getById } = useCollection('posts', {
      type: 'event',
    })
    const { getProfile } = useProfiles()
    const { getStylesDropdown } = useStyles()

    const eventType = ref('')

    const view = ref('list')
    const viewOptions = [
      {
        value: 'covers',
        label: 'Grid View',
      },
      {
        value: 'list',
        label: 'Calendar',
      },
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

      const startDate = getDateObect(item.startDate)
      const organiser = getProfile(item.createdBy).username
      const locality = addressPart(item.venue, 'locality')

      return {
        ...item,
        startDate,
        organiser,
        locality,
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

    const loading = computed(() => loadingPosts.value)

    const activeFilter = ref('all')

    const isPublic = (item) => item.visibility !== 'Unlisted'

    const filterOptions = computed(() => [
      {
        value: 'thisYear',
        label: 'This Year',
        filter: (item) =>
          getYmd(item.startDate) >= startOfTodayString &&
          getYmd(item.startDate) <= endOfYearString &&
          isPublic(item),
      },
      {
        value: 'all',
        label: 'All',
        filter: (item) =>
          getYmd(item.startDate) >= startOfTodayString && isPublic(item),
      },
      {
        value: 'mine',
        label: 'Created by me',
        filter: (item) => item.createdBy === uid.value,
      },
      {
        value: 'schedule',
        label: 'My schedule',
        filter: (item) =>
          item.response === 'up' && getYmd(item.startDate) >= startOfWeekString,
      },
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
      eventTypeListIcons,
      eventType,
      danceStyles,
    }
  },
  head() {
    return {
      title: 'WeDance Events',
    }
  },
}
</script>
