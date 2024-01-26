<template>
  <div v-if="response && response.facets && response.nbHits">
    <div class="mb-4 gap-2 flex flex-wrap p-4 items-center">
      <t-rich-select
        v-model="filters['style']"
        placeholder="Style"
        :options="facets['style']"
        clearable
        hide-search-box
      />

      <t-rich-select
        v-model="filters['type']"
        placeholder="Format"
        :options="facets['type']"
        clearable
        hide-search-box
      />

      <DatePicker
        v-model="fromDate"
        :lang="{ formatLocale: { firstDayOfWeek: 1 } }"
        value-type="timestamp"
        class="w-32 py-4"
        placeholder="Date"
        format="D MMM YY"
        :clearable="false"
      />

      <TButton v-if="facetFilters" allow-guests type="link" @click="load()">
        {{ $t('filter.reset') }}
      </TButton>

      <TButton type="nav" icon="share" @click="showPopup = true" />
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

    <div>
      <div v-for="(items, date) in itemsByDate" :key="date">
        <h2 class="font-bold text-xl p-4 border-b">
          <span class="text-primary">{{ getDay(date, $i18n.locale) }}</span> ·
          {{ getDate(date, $i18n.locale) }}
        </h2>
        <TEventText4
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          class="hover:opacity-75"
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

    <div v-if="!response.nbHits" class="p-4 flex justify-center items-center">
      <div>
        <h2 class="text-lg font-semibold">No Events Found</h2>
        <p class="text-sm mt-2">
          Dates: <span class="font-medium">{{ getDate(fromDate) }}</span> to
          <span class="font-medium">{{ getDate(untilDate) }}</span>
        </p>

        <div class="mt-4 p-4 typo bg-orange-50">
          <p>
            It seems there are no events listed for your selected dates. But
            don't worry, you've got options:
          </p>

          <ul>
            <li>
              <strong>Expand Your Search:</strong> Try adjusting your date range
              or filters to explore other events.
            </li>
            <li>
              <strong>Import an Event:</strong> Found something interesting
              elsewhere? Easily
              <router-link to="/events/-/import"
                >import events from Facebook</router-link
              >
              or other platforms to share with the community.
            </li>
            <li>
              <strong>Create and Share:</strong> Can’t find what you’re looking
              for? You can manually
              <router-link to="/events/-/edit"
                >add details of events</router-link
              >
              you know about or host your own event on our platform.
            </li>
            <li>
              <strong>Stay in the Loop:</strong> Subcribe to get updates on new
              events in your areas of interest.
            </li>
          </ul>
          <p class="mt-4">
            Help grow our community by sharing events you’re excited about!
            Thank you for being a part of WeDance.
          </p>
        </div>
      </div>
    </div>

    <t-pagination
      v-if="response.nbPages > 1 && !$route.query.search"
      v-model="currentPage"
      :total-items="response.nbHits"
      :per-page="response.hitsPerPage"
      class="my-4"
    />
  </div>
  <div v-else>
    <slot />
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
import { useCities } from '~/use/cities'
import { useApp } from '~/use/app'

export default {
  name: 'TCalendar',
  props: {
    profile: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const radius = ref(50)
    const query = ref('')
    const sorting = ref('Upcoming')
    const profileType = ref('')
    const currentPage = ref(1)
    const filters = ref({})
    const { uid } = useAuth()
    const { city, currentCity, cityName } = useCities()
    const { getCity } = useApp()
    let today = new Date(Date.now())
    today.setHours(6, 0, 0, 0)
    today = +today
    const fromDate = ref(today)

    const untilDate = computed(() => {
      const oneWeekLater = new Date(fromDate.value)
      oneWeekLater.setDate(oneWeekLater.getDate() + 7)
      return +oneWeekLater
    })

    if (!currentCity.value) {
      return
    }
    const { search, response } = useAlgolia('events')
    const facets = computed(() => ({
      type: getFacetOptions('type'),
      style: getFacetOptions('style'),
      venue: getFacetOptions('venue'),
      organizer: getFacetOptions('organizer'),
    }))
    function load() {
      filters.value = {}
      query.value = ''
    }
    onMounted(load)
    const facetFilters = computed(() => {
      return Object.keys(filters.value)
        .filter((field) => filters.value[field])
        .map((field) => `${field}:${filters.value[field]}`)
        .join(',')
    })
    watch([currentPage, facetFilters, radius, city, fromDate], () => {
      if (!city.value?.location) {
        return
      }
      const searchParams = {
        filters: `startDate>${fromDate.value} AND startDate<${untilDate.value}`,
        facets: Object.keys(facets.value),
        facetFilters: facetFilters.value,
        page: currentPage.value - 1,
        aroundLatLng: radius.value
          ? `${city.value.location.latitude}, ${city.value.location.longitude}`
          : '',
        aroundRadius: radius.value * 1000 || 1,
        hitsPerPage: 100,
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
        result[date].push(item)
      })

      return result
    })

    const itemsAsText = computed(() => {
      let result = `**Dance Calendar in ${props.profile.name}**\n\n`
      result += `We help everyone to dance everywhere and all dancers to help each other\n\n`
      result += `🗓️ **Dance Calendar**\n`
      result += `${props.profile.telegram}\n\n`
      result += `➕ **Add your event**\n`
      result += `wedance.vip/${props.profile.username}\n\n`
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
      itemsAsText,
      copyToClipboard,
      showPopup,
      fromDate,
      untilDate,
      sorting,
      uid,
      getFacetOptions,
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
      radius,
      load,
      getCity,
      cityName,
      getDateObect,
      itemsByDate,
      getDay,
      getDate,
    }
  },
}
</script>
