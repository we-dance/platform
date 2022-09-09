<template>
  <main>
    <THeader :title="$t('events.title')">
      <TButton type="nav" icon="plus" to="/events/-/edit" />
    </THeader>

    <div class="space-y-2 p-2 border-b">
      <div class="flex justify-center overflow-x-scroll">
        <div class="flex flex-nowrap text-center">
          <TButton
            v-for="option in addLabelIcons(eventCategoryOptions)"
            :key="option.value"
            allow-guests
            :to="getRoute({ category: option.value })"
            class="m-1 leading-normal"
            :type="option.value === category ? 'toggled' : 'simple'"
            >{{ option.label }}</TButton
          >
        </div>
      </div>

      <div class="md:flex md:space-x-2 space-y-2 md:space-y-0">
        <TButton
          allow-guests
          to="/cities?target=/events"
          icon="place"
          :label="cityName || $t('cities.choose')"
          class="w-full md:w-auto"
        />

        <div class="flex space-x-2">
          <TRichSelect
            v-model="dance"
            clearable
            :options="danceStyles"
            :placeholder="$t('events.filter.style')"
            @input="
              (val) => $router.push(getRoute({ dance: val || 'any-dance' }))
            "
          />
          <TRichSelect
            v-model="level"
            clearable
            :options="levelOptions"
            :placeholder="$t('events.filter.level')"
            @input="
              (val) => $router.push(getRoute({ level: val || 'any-level' }))
            "
          />
        </div>
      </div>
    </div>

    <div>
      <TLoader v-if="loading" />
      <div v-else-if="!count" class="p-4">
        {{ $t('events.list.empty') }}
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
        url="/signin"
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
import { computed, onMounted, ref } from '@nuxtjs/composition-api'
import { startOfWeek, addDays } from 'date-fns'
import { useCollection } from '~/use/collection'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useProfiles } from '~/use/profiles'
import { useEvents } from '~/use/events'
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
import { useRouter } from '~/use/router'

export default {
  name: 'Calendar',
  setup() {
    const { levelOptions } = useStyles()
    const { route, router } = useRouter()
    const { eventCategoryOptions, addLabelIcons } = useEvents()
    const { cityName, changeCityByName } = useCities()
    const { docs, loading: loadingPosts, getById } = useCollection('posts', {
      type: 'event',
    })
    const { getProfile } = useProfiles()
    const { getStylesDropdown } = useStyles()

    const defaultCategory = 'meetup'

    const category = ref(route.params.category || defaultCategory)
    const city = ref((route.params.city || '').replace('anywhere', ''))
    const dance = ref((route.params.dance || '').replace('any-dance', ''))
    const level = ref((route.params.level || '').replace('any-level', ''))

    const getRoute = (changes) => {
      const currentParams = {
        city: cityName.value || 'anywhere',
        category: category.value || defaultCategory,
        dance: dance.value || 'any-dance',
        level: level.value || 'any-level',
      }

      const params = {
        ...currentParams,
        ...changes,
      }

      return {
        name: 'Calendar',
        params,
      }
    }

    onMounted(async () => {
      if (city.value && city.value !== cityName.value) {
        await changeCityByName(route.params.city)
      }

      if (!route.params.dance) {
        router.replace(getRoute({}))
      }
    })

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
    const endOfWeekString = getYmd(addDays(startOfWeekDate, 7))

    const count = computed(() => items.value.length)

    const loading = computed(() => loadingPosts.value)

    const activeFilter = ref('all')

    const isSelectedCategory = (item) =>
      eventCategoryOptions
        .find((option) => option.value === category.value)
        .filter(item)

    const isSelectedStyle = (item) =>
      item.styles &&
      item.styles[dance.value] &&
      item.styles[dance.value].selected

    const isSelectedLevel = (item) => {
      if (!item.styles) {
        return false
      }

      const styles = Object.keys(item.styles)
      for (const style of styles) {
        if (item.styles[style].level === level.value) {
          return true
        }
      }

      return false
    }

    const items = computed(() => {
      let result = docs.value.map(map)

      if (dance.value) {
        result = result.filter(isSelectedStyle)
      }

      if (level.value) {
        result = result.filter(isSelectedLevel)
      }

      if (category.value) {
        result = result.filter(isSelectedCategory)
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
      count,
      events: items,
      itemsByDate,
      dateDiff,
      loading,
      getById,
      uid,
      getDay,
      getDate,
      getDateObect,
      startOfWeekString,
      endOfWeekString,
      activeFilter,
      dance,
      view,
      viewOptions,
      eventCategoryOptions,
      category,
      addLabelIcons,
      danceStyles,
      cityName,
      level,
      levelOptions,
      getRoute,
    }
  },
  head() {
    return {
      title: 'WeDance Events',
    }
  },
}
</script>
