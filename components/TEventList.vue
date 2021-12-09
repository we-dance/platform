<template>
  <div>
    <TLoader v-if="loading" />
    <div v-else-if="!count && showEmpty">
      {{ emptyLabel }}
    </div>
    <h2 v-if="title" class="font-bold text-lg">{{ title }}</h2>
    <div class="flex justify-end">
      <TButton type="nav" icon="copy" @click="copyToClipboard" />
    </div>
    <div v-if="items.length" class="space-y-8 mt-4">
      <div v-for="(items, date) in itemsByDate" :key="date">
        <h2 class="font-bold bg-dark text-white py-2 px-4 rounded">
          {{ getDay(date) }}, {{ getDate(date) }}
        </h2>
        <div v-for="item in items" :key="item.id" class="px-4 mt-4">
          <TEventText :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { computed, ref } from '@nuxtjs/composition-api'
import { startOfWeek, addDays, endOfYear } from 'date-fns'
import { useCollection } from '~/use/collection'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import {
  dateDiff,
  sortBy,
  getTime,
  getDate,
  getDay,
  getYmd,
  getDateObect,
} from '~/utils'

export default {
  name: 'TEventList',
  props: {
    filter: {
      type: Object,
      default: null,
    },
    tab: {
      type: String,
      default: 'all',
    },
    community: {
      type: String,
      default: 'VIP',
    },
    title: {
      type: String,
      default: '',
    },
    emptyLabel: {
      type: String,
      default: 'No scheduled events',
    },
    showEmpty: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { currentCity } = useCities()
    const { docs, loading, getById } = useCollection('events', props.filter)

    const { uid } = useAuth()

    const map = (item) => {
      if (!item.id) {
        return {}
      }

      const startDate = getDateObect(item.startDate)

      return {
        ...item,
        startDate,
      }
    }

    const now = new Date()
    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 })
    const startOfWeekString = getYmd(startOfWeekDate)
    const startOfTodayString = getYmd(now)
    const endOfWeekString = getYmd(addDays(startOfWeekDate, 7))
    const in10daysString = getYmd(addDays(now, 10))
    const in7daysString = getYmd(addDays(now, 7))
    const endOfYearString = getYmd(endOfYear(now))

    const count = computed(() => items.value.length)

    const activeFilter = ref(props.tab)

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
        value: '10days',
        label: '10 days',
        filter: (item) =>
          getYmd(item.startDate) >= startOfTodayString &&
          getYmd(item.startDate) <= in10daysString &&
          isPublic(item),
      },
      {
        value: '7days',
        label: '7 days',
        filter: (item) =>
          getYmd(item.startDate) >= startOfTodayString &&
          getYmd(item.startDate) <= in7daysString &&
          isPublic(item),
      },
      {
        value: 'all',
        label: 'All',
        filter: (item) =>
          getYmd(item.startDate) >= startOfTodayString && isPublic(item),
      },
    ])

    const activeFilterItem = computed(() =>
      filterOptions.value.find((item) => item.value === activeFilter.value)
    )

    const items = computed(() => {
      let result = docs.value.map(map)

      result = result.filter(activeFilterItem.value.filter)

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

    const itemsAsText = computed(() => {
      let result = ''

      _.forEach(itemsByDate.value, (items, date) => {
        result += String(`**${getDay(date)} ${getDate(date)}**\n`).toUpperCase()
        items.forEach((item) => {
          result += `${getTime(item.startDate)} ❤️ ${item.name}\n`
          if (item.venue) {
            result += `📍 ${item.venue?.name}\n`
          }
          result += `💸 ${item.price}\n`
          result += `\n`
        })
      })

      result += `👉 Details about events on https://wedance.vip/${props.community}\n\n`
      result += `👉 Announcements on https://instagram.com/WeDance${props.community}\n\n`
      result += `👉 Festivals on https://t.me/WeDanceVIP\n\n`
      result += `👉 Add your event via website.`

      return result
    })

    async function copyToClipboard() {
      await navigator.clipboard.writeText(itemsAsText.value)
    }

    return {
      currentCity,
      count,
      itemsByDate,
      items,
      dateDiff,
      loading,
      getById,
      uid,
      getTime,
      getDay,
      getDate,
      startOfWeekString,
      endOfWeekString,
      activeFilter,
      filterOptions,
      copyToClipboard,
    }
  },
}
</script>
