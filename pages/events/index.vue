<template>
  <div>
    <div class="flex items-baseline justify-between mb-4 pb-4 border-b">
      <h1 class="text-xl font-bold">Events</h1>
    </div>

    <TLoader v-if="loading" />
    <div v-else-if="eventsTotal > 0">
      Found {{ eventsTotal }} events in
      <template v-if="searchLocation">{{ searchLocation.name }}</template
      ><template v-else>the world</template>
    </div>
    <div v-else-if="eventsTotal === 0">
      No events found.
    </div>

    <div class="mt-4">
      <TCard
        v-for="event in events"
        :id="event.id"
        :key="event.id"
        :item="event"
        type="event"
      />
    </div>

    <button
      v-if="eventsTotal && searchOffset < eventsTotal"
      @click="startSearch(true)"
    >
      Load More
    </button>
  </div>
</template>

<script>
import axios from 'axios'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'
import { imageExists } from '~/utils'

export default {
  props: {
    city: {
      type: String,
      default: null
    },
    genre: {
      type: String,
      default: null
    },
    entity: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    day: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    eventsTotal: -1,
    events: [],
    mode: 'list',
    selectedGenres: [],
    selectedTypes: [],
    types: [],
    genres: [],
    selectedItem: 0,
    showMap: false,
    showCover: true,
    search: '',
    searchLocation: undefined,
    showFilter: false,
    radius: 25,
    radiusSteps: [5, 10, 25, 50, 100, 500, 1000, 5000, 10000],
    infoOptions: {
      pixelOffset: {
        width: 0,
        height: -35
      }
    },
    infoWindowPos: null,
    infoWinOpen: false,
    left: true,
    right: false,
    loading: false,
    filterDescription: '',
    mainNavigation: true,
    searchOffset: 0
  }),

  async mounted() {
    this.searchLocation = {
      name: 'Munich',
      latitude: 48.1351253,
      longitude: 11.581980499999986
    }

    await this.load()
    this.startSearch()
  },

  methods: {
    async startSearch(loadMore) {
      let bool
      const must = []
      let filter
      let query

      const now = new Date()

      must.push({
        range: {
          startTime: {
            gt: now
          }
        }
      })

      if (this.selectedGenres.length) {
        must.push({
          terms: {
            genres: this.selectedGenres
          }
        })
      }

      if (this.selectedTypes.length) {
        must.push({
          terms: {
            types: this.selectedTypes
          }
        })
      }

      if (this.searchLocation) {
        filter = {
          geo_distance: {
            distance: `${this.radius}km`,
            geolocation: {
              lat: this.searchLocation.latitude,
              lon: this.searchLocation.longitude
            }
          }
        }
      }

      if (filter) {
        bool = bool || {}
        bool.filter = filter
      }

      if (must.length) {
        bool = bool || {}
        bool.must = must
      }

      if (bool) {
        query = {
          bool
        }
      }

      const result = await axios.post(
        `https://elastic.api.dancecard.id/events/_search`,
        {
          sort: [
            {
              startTime: { order: 'asc' }
            }
          ],
          from: this.searchOffset,
          query
        }
      )

      const foundEvents = this.filterEvents(
        result.data.hits.hits.map((item) => item._source)
      )

      const filteredEvents = []

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array)
        }
      }

      const filterEvents = async () => {
        await asyncForEach(foundEvents, async (event) => {
          const exists = await imageExists(event.cover)

          if (exists) {
            filteredEvents.push(event)
          } else {
            this.report(event.id)
          }
        })
      }

      if (foundEvents) {
        await filterEvents()
      }

      if (!loadMore) {
        this.events = []
        this.searchOffset = 0
      }

      this.events = [...this.events, ...filteredEvents]

      this.searchOffset += result.data.hits.hits.length
      // this.eventsTotal = result.data.hits.total.value
      this.eventsTotal = filteredEvents.length
    },

    toggleMap() {
      this.showMap = !this.showMap
    },

    selectItem(index) {
      this.selectedItem = index
      this.infoWinOpen = true
    }
  },
  setup() {
    const { uid, account } = useAuth()
    const { create } = useDoc('reportedEvents')
    const { docs, load, loading } = useCollection('reportedEvents')

    const filterEvents = (events) => {
      return events.filter((e) => !docs.value.find((r) => r.eventId === e.id))
    }

    const report = (id) => {
      create({
        eventId: id,
        reason: 'missing_cover'
      })
    }

    return {
      uid,
      account,
      report,
      filterEvents,
      load,
      loading
    }
  }
}
</script>
