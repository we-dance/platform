<template>
  <div>
    <TPopup v-if="showPopup" title="Share" @close="showPopup = false">
      <TInputButtons v-model="shareType" :options="shareTypeOptions" />
      <div v-if="shareType === 'text'" class="flex flex-col py-4 gap-4">
        <textarea
          v-model="itemsAsText"
          class="text-xs font-mono border"
          cols="30"
          rows="10"
        ></textarea>
        <TButton
          type="primary"
          icon="copy"
          label="Copy"
          @click="copyToClipboard(itemsAsText)"
        />
      </div>
      <div v-if="shareType === 'embed'" class="flex flex-col py-4 gap-4">
        <textarea
          v-model="iframeCode"
          class="text-xs font-mono border"
          cols="30"
          rows="10"
        ></textarea>

        <TButton
          type="primary"
          icon="copy"
          label="Copy"
          @click="copyToClipboard(iframeCode)"
        />
      </div>
    </TPopup>
    <TLoader v-if="loading" />
    <div v-else-if="!count && showEmpty">
      {{ emptyLabel }}
    </div>
    <div v-if="items.length" class="flex justify-between items-center px-4">
      <h2 v-if="title" class="text-xs text-gray-700">{{ title }}</h2>
      <div v-else></div>
      <TButton type="nav" icon="share" @click="showPopup = true" />
    </div>
    <div v-if="items.length" class="space-y-8 mt-4">
      <div v-for="(items, date) in itemsByDate" :key="date">
        <h2 class="font-bold text-xl p-4 border-b">
          <span class="text-primary">{{ getDay(date) }}</span> ·
          {{ getDate(date) }}
        </h2>
        <div v-for="item in items" :key="item.id">
          <TEventText2 :item="item" :is-embed="isEmbed" />
        </div>
      </div>
      <div></div>
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
    isEmbed: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      default: 'Travel',
    },
    filter: {
      type: Object,
      default: null,
    },
    comparison: {
      type: String,
      default: '==',
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
    docs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { currentCity } = useCities()
    const { docs, loading, getById } = useCollection(
      'posts',
      props.filter,
      props.comparison
    )
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
      let result = props.docs.length ? props.docs.map(map) : docs.value.map(map)
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
      let result = `**Dance Calendar in ${props.community}**\n\n`
      result += `We help everyone to dance everywhere and all dancers to help each other\n\n`
      result += `🗓️ **Dance Calendar**\n`
      result += `t.me/WeDance${props.community}\n\n`
      result += `✈️ **Calendar of Dance Festivals**\n`
      result += `t.me/WeDanceTravel\n\n`
      result += `➕ **Add your event**\n`
      result += `wedance.vip/${props.community}\n\n`
      result += `🗓 **DANCE CALENDAR** 🗓 \n\n`
      _.forEach(itemsByDate.value, (items, date) => {
        result += String(`**${getDay(date)} ${getDate(date)}**\n`).toUpperCase()
        items.forEach((item) => {
          result += `${getTime(item.startDate)} ❤️ ${item.name}\n`
          if (item.venue) {
            result += `📍 ${item.venue?.name}\n`
          }
          result += `💸 ${item.price}\n`
          result += `wedance.vip/${item.org.username}\n`
          result += `\n`
        })
      })
      return result
    })

    const iframeCode = computed(() => {
      return `<iframe width="100%" height="560" title="WeDance Calendar" frameborder="0" src="https://wedance.vip/${props.username}/embed"></iframe>`
    })

    async function copyToClipboard(val) {
      await navigator.clipboard.writeText(val)
    }

    const showPopup = ref(false)

    const shareTypeOptions = [
      {
        value: 'text',
        label: 'Text',
      },
      {
        value: 'embed',
        label: 'Embed',
      },
    ]
    const shareType = ref('text')

    return {
      itemsAsText,
      iframeCode,
      shareTypeOptions,
      shareType,
      showPopup,
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
