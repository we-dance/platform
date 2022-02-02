<template>
  <div>
    <div class="inline-block w-full relative cursor-pointer">
      <div
        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        @click="showPopup = true"
      >
        <div v-if="!loading">
          {{ getLabel(value) }}
          <span
            v-if="gpsIsBlocked"
            class="w-2 h-2 rounded-full bg-red-500"
          ></span>
        </div>
        <div v-else>Locating...</div>
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg
          class="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
          />
        </svg>
      </div>
    </div>

    <TPopup v-if="showPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">{{ popupTitle }}</div>
        <button class="cursor-pointer" @click="showPopup = false">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>

      <div class="flex">
        <TInput v-model="input" :placeholder="searchPlaceholder" />
      </div>

      <div
        v-if="!gpsIsBlocked"
        class="p-2 hover:bg-indigo-500 text-black hover:text-white cursor-pointer flex items-center"
        @click="locate"
      >
        <TIcon :name="loading ? 'coffee' : 'gps_fixed'" class="h-4 w-4 mr-2" />
        <span>Locate me</span>
      </div>
      <div
        class="p-2 hover:bg-indigo-500 text-black hover:text-white cursor-pointer flex items-center"
        @click="change('')"
      >
        <span>(Empty)</span>
      </div>
      <div v-if="predictions.length">
        <div
          v-for="prediction in predictions"
          :key="prediction.place_id"
          class="p-2 hover:bg-indigo-500 text-black hover:text-white cursor-pointer text-left"
          @click="select(prediction.place_id)"
        >
          {{ prediction.description }}
        </div>
      </div>
      <div v-else>
        <div
          v-for="city in cities"
          :key="city.locality"
          class="p-2 hover:bg-indigo-500 text-black hover:text-white cursor-pointer text-left"
          @click="change(city)"
        >
          {{ city.locality }}
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import { getLocation, sanitize } from '~/utils'
import { useDoc } from '~/use/doc'
import { googleApiKey } from '~/plugins/firebase'

Vue.use(VueGoogleMaps, {
  load: {
    key: googleApiKey,
    libraries: 'places',
    language: 'en',
  },
})

const gmapApi = VueGoogleMaps.gmapApi

export default {
  name: 'TInputLocationSelect',
  setup() {
    const { find, create, id, update, doc } = useDoc('cities')

    return {
      find,
      create,
      update,
      id,
      doc,
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: '',
    },
    autoSelect: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: 'Search city',
    },
    emptyLabel: {
      type: String,
      default: 'Select city',
    },
    popupTitle: {
      type: String,
      default: 'Change city',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    input: '',
    predictions: [],
    gpsIsBlocked: false,
    loading: false,
    showPopup: false,
    cities: [
      {
        locality: 'Berlin',
        country: 'Germany',
        label: 'Berlin',
      },
      {
        locality: 'Munich',
        country: 'Germany',
        label: 'Munich',
      },
      {
        locality: 'Frankfurt',
        country: 'Germany',
        label: 'Frankfurt',
      },
      {
        locality: 'Stuttgart',
        country: 'Germany',
        label: 'Stuttgart',
      },
    ],
  }),

  computed: {
    google: gmapApi,
  },

  watch: {
    value(val) {
      this.input = ''
    },

    input(val) {
      if (!val) {
        return
      }

      if (!this.google) {
        return
      }

      const autocomplete = new this.google.maps.places.AutocompleteService()
      autocomplete.getPlacePredictions(
        {
          input: val,
          types: ['(cities)'],
        },
        this.updateList
      )
    },
  },

  async mounted() {
    this.input = ''

    await this.$gmapApiPromiseLazy()

    if (this.autoSelect && !this.value) {
      this.requestBrowserLocation()
    }
  },

  methods: {
    locate() {
      this.showPopup = false
      this.requestBrowserLocation()
    },
    open() {
      this.predictions = []
      this.showPopup = true
    },
    getLabel(location) {
      if (!location) {
        return this.emptyLabel
      }

      return location.locality
    },
    change(location) {
      this.showPopup = false
      this.$emit('input', location)
    },

    updateList(predictions, status) {
      if (status !== 'OK') {
        return
      }

      this.predictions = predictions
    },

    select(placeId) {
      this.geoCodePlaceId(placeId)
    },

    geoCodePlaceId(placeId) {
      if (!this.google) {
        return
      }

      const geocoder = new this.google.maps.Geocoder()
      geocoder.geocode({ region: 'us', placeId }, (response, status) => {
        this.loading = false

        const location = getLocation(response[0], false)
        this.selectLocation(location)
      })
    },

    async selectLocation(location) {
      await this.find('location.place_id', location.place_id)

      const cityName = sanitize(location.locality, ' ')

      if (!this.id) {
        this.create({
          name: cityName,
          location,
          status: 'requested',
          hits: 1,
        })
      } else {
        this.update(this.id, {
          hits: parseInt(this.doc.hits || 0) + 1,
        })
      }

      this.change(location)
    },

    async requestBrowserLocation() {
      this.loading = true

      window.navigator.geolocation.getCurrentPosition(
        await this.updateLocationFromBrowser,
        () => {
          this.loading = false
          this.gpsIsBlocked = true
        }
      )
    },

    updateLocationFromBrowser(position) {
      if (!this.google) {
        return
      }

      const geocoder = new this.google.maps.Geocoder()
      geocoder.geocode(
        {
          region: 'us',
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        },
        (response, status) => {
          const location = getLocation(response[5], true)
          this.selectLocation(location)
        }
      )
    },
  },
}
</script>
