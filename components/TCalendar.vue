<template>
  <div>
    <div class="p-4 gap-2 flex flex-nowrap items-center border-b">
      <t-rich-select
        v-model="filters['style']"
        :placeholder="$t('calendar.filters.style')"
        :options="facets['style']"
        clearable
        hide-search-box
      />

      <t-rich-select
        v-if="facets['country'].length > 1"
        v-model="filters['country']"
        placeholder="Country"
        :options="facets['country']"
        clearable
        hide-search-box
      />

      <t-rich-select
        v-if="facets['locality'].length > 1"
        v-model="filters['locality']"
        placeholder="City"
        :options="facets['locality']"
        clearable
        hide-search-box
      />

      <t-rich-select
        v-if="view === 'classes' || view === 'online'"
        v-model="level"
        :placeholder="$t('calendar.filters.level')"
        :options="levels"
        clearable
        hide-search-box
      />

      <TButton
        :to="localePath('/events/-/import')"
        icon="plus"
        :label="$t('calendar.addEvent')"
        type="primary"
      />
    </div>

    <TPopup v-if="showPopup" title="Share" @close="showPopup = false">
      <div class="mb-4">
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
    </TPopup>

    <TFindPartnerTeaser
      v-if="featureFindPartner && (view === 'classes' || view === 'online')"
      class="p-4"
    />

    <div>
      <div v-for="(items, date) in itemsByDate" :key="date">
        <h2 class="font-bold text-xl p-4 border-b">
          <span v-if="todayYmd === date" class="text-primary">Today · </span>
          <span v-if="tomorrowYmd === date" class="text-primary"
            >Tomorrow ·
          </span>
          <span class="text-primary">{{ getDay(date, $i18n.locale) }}</span> ·
          {{ getDate(date, $i18n.locale) }}
        </h2>
        <TEventText4
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          :name="item.name"
          :cover="item.cover"
          :venue="item.venue"
          :price="item.price"
          :start-date="getDateObect(item.startDate)"
          :event-type="item.type"
          :styles="item.styles"
          :organiser="item.organizer"
        />
      </div>
    </div>

    <div
      v-if="!loading && !response.nbHits"
      class="p-4 flex justify-center items-center"
    >
      <div>
        <div class="text-center max-w-xs mx-auto text-gray-800">
          <div>Oops, no events yet.</div>
          <div>
            <router-link
              :to="localePath(`/explore/${city.username}/tips`)"
              class="text-primary underline hover:no-underline"
              >Ask locals</router-link
            >
            — get tips in 48 hours!
          </div>
        </div>
      </div>
    </div>

    <div v-if="response.nbPages > 1" class="my-4 flex justify-center">
      <TButton label="Load More" type="primary" @click="loadMore" />
    </div>

    <div class="p-4 gap-2 flex items-center border-b">
      <div class="text-xs">After</div>
      <DatePicker
        v-model="fromDate"
        :lang="{ formatLocale: { firstDayOfWeek: 1 } }"
        value-type="timestamp"
        class="w-32 py-4"
        placeholder="Date"
        format="D MMM YY"
        :clearable="false"
      />
      <TButton label="Share" icon="share" @click="showPopup = true" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { computed, onMounted, ref, watch } from 'vue-demi'
import {
  getExcerpt,
  getDateObect,
  getYmd,
  getDate,
  getDay,
  getTime,
} from '~/utils'
import { useAlgolia } from '~/use/algolia'
import { useStyles } from '~/use/styles'
import { useAuth } from '~/use/auth'

export default {
  name: 'TCalendar',
  props: {
    city: {
      type: Object,
      default: null,
    },
    view: {
      type: String,
      default: 'parties',
    },
  },
  setup(props, { root }) {
    const level = ref('')
    const levels = [
      { value: 'Beginner', label: 'Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced', label: 'Advanced' },
    ]

    const radius = ref(root.$route.query.radius || 50)
    const query = ref('')
    const sorting = ref('Upcoming')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid, featureFindPartner } = useAuth()
    let today = new Date(Date.now())
    today.setHours(6, 0, 0, 0)
    today = +today
    const fromDate = ref(today)
    const todayYmd = getYmd(today)
    const tomorrowYmd = getYmd(today + 24 * 60 * 60 * 1000)

    const untilDate = computed(() => {
      const oneWeekLater = new Date(fromDate.value)
      oneWeekLater.setDate(oneWeekLater.getDate() + 7)
      return +oneWeekLater
    })

    if (!props.city) {
      return
    }

    const { search, response, loadMore, loading } = useAlgolia('events')
    const facets = computed(() => ({
      type: getFacetOptions('type'),
      style: getFacetOptions('style'),
      country: getFacetOptions('country'),
      locality: getFacetOptions('locality'),
      venue: getFacetOptions('venue'),
      organizer: getFacetOptions('organizer'),
    }))
    function load() {
      filters.value = {
        style: root.$route.query.style || '',
      }
      query.value = ''
    }
    onMounted(load)
    const facetFilters = computed(() => {
      return Object.keys(filters.value)
        .filter((field) => filters.value[field])
        .map((field) => `${field}:${filters.value[field]}`)
        .join(',')
    })
    const filter = computed(() => {
      if (props.view === 'parties') {
        return '(type:Party OR type:Other OR type:Show OR type:Concert OR type:Festival OR type:Congress)'
      }
      if (props.view === 'classes') {
        return '(type:Course OR type:Workshop OR type:Festival OR type:Congress)'
      }
      if (props.view === 'online') {
        return '(online:Yes)'
      }
      if (props.view === 'festivals') {
        return '(type:Festival OR type:Congress)'
      }
    })

    watch(
      () => filters.value.style,
      (newStyle) => {
        if (newStyle) {
          // root.$router.replace({ query: { style: newStyle } }, { silent: true })
          history.pushState({}, null, root.$route.path + `?style=${newStyle}`)
        }
      }
    )

    watch([currentPage, facetFilters, radius, fromDate], () => {
      const searchParams = {
        filters: `startDate>${fromDate.value} AND ${filter.value}`,
        facets: Object.keys(facets.value),
        facetFilters: facetFilters.value,
        page: currentPage.value - 1,
        hitsPerPage: 10,
      }

      if (props.city?.location) {
        searchParams.aroundLatLng = radius.value
          ? `${props.city.location.latitude}, ${props.city.location.longitude}`
          : ''

        searchParams.aroundRadius = radius.value * 1000 || 1000
      }

      search('', searchParams)
    })
    const { getStyleName } = useStyles()
    function getFacetOptions(field) {
      if (!response.value?.facets || !response.value.facets[field]) {
        return []
      }
      return Object.keys(response.value.facets[field]).map((val) => ({
        value: val,
        label: `${getFieldLabel(field, val)} (${
          response.value.facets[field][val]
        })`,
      }))
    }
    function getFieldLabel(field, value) {
      if (!value) {
        return ''
      }
      switch (field) {
        case 'style':
          return getStyleName(value)
        default:
          return value
      }
    }
    const itemsByDate = computed(() => {
      const result = {}

      if (!response.value?.hits) {
        return result
      }

      response.value.hits.forEach((item) => {
        const date = getYmd(item.startDate)
        result[date] = result[date] || []
        const event = {
          ...item,
          venue: [item.locality, item.country].filter((v) => v).join(', '),
        }
        result[date].push(event)
      })

      return result
    })

    const itemsAsText = computed(() => {
      let result = `**Dance Calendar in ${props.city.name}**\n\n`
      result += `We help everyone to dance everywhere and all dancers to help each other\n\n`
      result += `➕ **Add your event**\n`
      result += `wedance.vip/${props.city.username}\n\n`
      result += `🗓 **DANCE CALENDAR** 🗓 \n\n`
      _.forEach(itemsByDate.value, (items, date) => {
        result += String(`**${getDay(date)} ${getDate(date)}**\n`).toUpperCase()
        items.forEach((item) => {
          result += `${getTime(item.startDate)} ❤️ ${item.name}\n`
          if (item.venue) {
            result += `📍 ${item.venue}\n`
          }
          result += `💸 ${item.price}\n`
          result += `wedance.vip/events/${item.id}\n`
          result += `\n`
        })
      })
      return result
    })

    async function copyToClipboard(val) {
      await navigator.clipboard.writeText(val)
    }

    const showPopup = ref(false)

    return {
      todayYmd,
      tomorrowYmd,
      featureFindPartner,
      level,
      levels,
      itemsAsText,
      copyToClipboard,
      showPopup,
      fromDate,
      untilDate,
      sorting,
      uid,
      facets,
      getExcerpt,
      search,
      query,
      response,
      filters,
      currentPage,
      profileType,
      facetFilters,
      getFieldLabel,
      load,
      getDateObect,
      itemsByDate,
      getDay,
      getDate,
      loadMore,
      loading,
    }
  },
}
</script>
