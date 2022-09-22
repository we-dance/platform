<template>
  <main>
    <THeader :title="`${cityName} Dance Calendar`">
      <TButton type="nav" icon="plus" to="/events/-/edit" />
    </THeader>

    <div class="space-y-2 p-2 border-b">
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
        </div>
      </div>
    </div>

    <div>
      <div class="p-4">
        <h4 class="font-bold text-xl">Next 7 days in {{ cityName }}</h4>
        <p v-if="false" class="text-xs">
          <!-- todo: render from city.description -->
          Diana Tempel at Hofgarten, Pinakothek der Moderne, Luitpold park are
          the favorite spots of local dancers
        </p>
        <div class="flex mt-2 gap-2">
          <TButton title="Subscribe" @click="subscribing = true"
            >Subscribe</TButton
          >
          <TButton title="Add New Event" to="/events/-/edit"
            >Add New Event</TButton
          >
        </div>
      </div>

      <TLoader v-if="loading" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div
          v-if="!count"
          class="flex flex-col items-center bg-gray-200 p-4 m-2 rounded text-center"
        >
          <h4 class="font-bold">
            Request Events
          </h4>
          <p class="text-xs">
            Our volunteers are glad to help. Subscribe to announcements and we
            will find dance events and dancers for you within 48 hours.
          </p>
        </div>
        <NuxtLink
          v-for="item in events"
          :key="item.id"
          :to="`/events/${item.id}`"
          class="hover:opacity-75"
        >
          <TSharePreviewPost
            :username="item.org ? item.org.username : ''"
            collection="events"
            :title="item.name"
            :type="item.eventType"
            :description="getEventDescription(item)"
            :extra="item.locality"
            :photo="item.cover"
            :styles="item.styles"
            size="sm"
          />
        </NuxtLink>
        <div
          class="flex flex-col items-center bg-gray-200 p-4 m-2 rounded text-center"
        >
          <h4 class="font-bold">
            Announcements
          </h4>
          <p class="text-xs">Get notified about new events</p>
          <TButton class="mt-2" title="Subscribe" @click="subscribing = true"
            >Subscribe</TButton
          >
        </div>
      </div>

      <TCommunity class="pt-4 border-t" />

      <div class="flex flex-col items-center bg-gray-200 p-4 m-2 rounded">
        <h4 class="font-bold text-center">Know dancers in {{ cityName }}?</h4>
        <p class="text-xs">
          Help new dancers, recommend organisers, venues, artist and dancers
        </p>
        <TButton
          class="mt-2"
          title="Recommend a Dancer"
          @click="recommendingDancer = true"
          >Recommend a Dancer</TButton
        >
      </div>
    </div>

    <TPopup v-if="recommendingDancer" @close="recommendingDancer = false">
      <div class="max-w-md mx-auto py-4 h-64 overflow-y-scroll">
        <p class="font-bold">Recommend dancers</p>
        <TField
          v-model="newDancers"
          component="TInputArray"
          :children="{
            component: 'TInputProfile',
            placeholder: 'Instagram or Facebook',
          }"
          hide-label
        />
      </div>
    </TPopup>

    <TPopup
      v-if="subscribing"
      title="Announcements"
      @close="subscribing = false"
    >
      <div class="max-w-md mx-auto py-4 overflow-y-scroll">
        <TForm
          v-model="subscription"
          :fields="subscriptionFields"
          class="bg-white p-4 space-y-4"
          @save="subscribe"
        />
      </div>
    </TPopup>
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
import { useDoc } from '~/use/doc'

export default {
  name: 'Calendar',
  setup() {
    const { levelOptions } = useStyles()
    const { route } = useRouter()
    const { eventCategoryOptions, addLabelIcons } = useEvents()
    const { currentCity, cityName, changeCityByName } = useCities()
    const { create } = useDoc('subscribers')
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
        city: cityName.value || 'Anywhere',
        dance: dance.value || '',
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
    const startOfTodayString = getYmd(now)
    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 })
    const startOfWeekString = getYmd(startOfWeekDate)
    const endOfWeekString = getYmd(addDays(startOfWeekDate, 7))
    const dayIn7Days = getYmd(addDays(now, 8))
    const count = computed(() => items.value.length)
    const loading = computed(() => loadingPosts.value)
    const isUpcoming = (item) => getYmd(item.startDate) >= startOfTodayString
    const isNext7Days = (item) => getYmd(item.startDate) <= dayIn7Days
    const isInSelectedCity = (item) => item.place === currentCity.value
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
      result = result
        .filter(isInSelectedCity)
        .filter(isUpcoming)
        .filter(isNext7Days)
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
    const subscribing = ref(false)
    const recommendingDancer = ref(false)
    const newDancers = ref([])
    const subscription = ref({})
    const subscriptionFields = [
      {
        name: 'where',
        label: 'Where',
        labelPosition: 'top',
        component: 'TInputPlace',
      },
      {
        name: 'when',
        labelPosition: 'top',
        label: 'When',
        component: 'TInputSelect',
        options: [
          {
            value: 'daily',
            label: 'Daily (All Announcements)',
          },
          {
            value: 'weekly',
            label: 'Weekly (Digest)',
          },
          {
            value: 'custom',
            label: 'Custom Dates',
          },
        ],
      },
      {
        when: (i) => i.when === 'custom',
        name: 'startDate',
        type: 'datetime-local',
        labelPosition: 'top',
        label: 'Start Date',
      },
      {
        when: (i) => i.when === 'custom',
        name: 'endDate',
        type: 'datetime-local',
        labelPosition: 'top',
        label: 'End Date',
      },
      {
        name: 'styles',
        labelPosition: 'top',
        label: 'Dance Styles and Level',
        component: 'TInputStylesSelect2',
      },
    ]

    async function subscribe() {
      await create(subscription.value)
      subscribing.value = false
    }

    return {
      subscribe,
      subscription,
      subscriptionFields,
      subscribing,
      newDancers,
      recommendingDancer,
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
      currentCity,
    }
  },
  watch: {
    cityName() {
      this.subscription = {
        when: 'daily',
        where: this.currentCity,
      }
    },
  },
  head() {
    return {
      title: `${this.cityName} Dance Calendar`,
    }
  },
}
</script>
