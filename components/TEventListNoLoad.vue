<template>
  <div>
    <TPopup v-if="showPopup" :title="$t('Share')" @close="showPopup = false">
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
          :label="$t('Copy')"
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
    <div class="px-4">
      <h4 class="font-bold text-xl pb-4">{{ $t('calendar.title') }}</h4>
    </div>
    <div class="flex justify-start items-center px-4">
      <TButton to="/events/-/edit" type="primary" icon="plus" />
      <TInputButtons v-model="tab" :options="tabs" />
      <div class="flex-grow"></div>
      <TButton type="nav" icon="share" @click="showPopup = true" />
    </div>
    <div class="space-y-8 mt-4">
      <div v-if="!items.length" class="text-center text-sm p-4">
        {{ $t('calendar.empty') }}
      </div>
      <div v-for="(items, date) in itemsByDate" :key="date">
        <h2 class="font-bold text-xl p-4 border-b">
          <span class="text-primary">{{ getDay(date, $i18n.locale) }}</span> ·
          {{ getDate(date, $i18n.locale) }}
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
import {
  dateDiff,
  sortBy,
  getTime,
  getDate,
  getDay,
  getYmd,
  getDateObect,
} from '~/utils'
import { useI18n } from '~/use/i18n'

export default {
  name: 'TEventListNoLoad',
  props: {
    isEmbed: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      default: 'Travel',
    },
    community: {
      type: String,
      default: 'Travel',
    },
    docs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { t } = useI18n()

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
    const startOfTodayString = getYmd(now)
    const inFuture = (item) => getYmd(item.startDate) >= startOfTodayString
    const inPast = (item) => getYmd(item.startDate) < startOfTodayString
    const tab = ref('upcoming')
    const tabs = [
      {
        label: t('calendar.upcoming'),
        value: 'upcoming',
      },
      {
        label: t('calendar.past'),
        value: 'past',
      },
    ]

    const items = computed(() => {
      let result = props.docs.map(map)

      if (tab.value === 'upcoming') {
        result = result.filter(inFuture)
        result = result.sort(sortBy('startDate'))
      } else {
        result = result.filter(inPast)
        result = result.sort(sortBy('-startDate'))
      }

      return result
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
          result += `wedance.vip/${item.org?.username}\n`
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
        label: t('calendar.share.text'),
      },
      {
        value: 'embed',
        label: t('calendar.share.embed'),
      },
    ]
    const shareType = ref('text')

    return {
      tab,
      tabs,
      itemsAsText,
      iframeCode,
      shareTypeOptions,
      shareType,
      showPopup,
      itemsByDate,
      items,
      dateDiff,
      getTime,
      getDay,
      getDate,
      copyToClipboard,
    }
  },
}
</script>
