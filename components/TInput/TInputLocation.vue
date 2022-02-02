<template>
  <div>
    <div class="flex justify-between items-center p-2 rounded border">
      <div class="text-gray-700">{{ getLabel(value) }}</div>
      <button class="underline text-blue-500 hover:no-underline" @click="open">
        {{ buttonLabel }}
      </button>
    </div>

    <TPopup v-if="showPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">{{ popupTitle }}</div>
        <button class="cursor-pointer" @click="showPopup = false">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>

      <TLoader v-if="loading" />
      <div v-else>
        <TInput v-model="input" :placeholder="searchPlaceholder" />

        <div class="border divide-y">
          <div
            v-for="prediction in predictions"
            :key="prediction.place_id"
            class="p-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
            @click="select(prediction.place_id)"
          >
            {{ prediction.description }}
          </div>
        </div>

        <div class="flex justify-start mt-4">
          <TButton :disabled="gpsIsBlocked" @click="requestBrowserLocation()">
            <div class="flex items-center">
              <TIcon name="gps_fixed" class="h-4 w-4 mr-1" />
              <div>Use my current position</div>
            </div>
          </TButton>
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import { googleApiKey } from '~/plugins/firebase'
import { getLocation } from '~/utils'

Vue.use(VueGoogleMaps, {
  load: {
    key: googleApiKey,
    libraries: 'places',
    language: 'en',
  },
})

const gmapApi = VueGoogleMaps.gmapApi

export default {
  name: 'TInputLocation',
  props: {
    value: {
      type: [Object, String],
      default: '',
    },
    popupTitle: {
      type: String,
      default: 'Select city',
    },
    searchPlaceholder: {
      type: String,
      default: 'Search city',
    },
    emptyLabel: {
      type: String,
      default: '(Not specified)',
    },
    buttonLabel: {
      type: String,
      default: 'Change',
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
    showPopup: false,
    loading: false,
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
  },

  methods: {
    open() {
      this.predictions = []
      this.showPopup = true
    },
    getLabel(location) {
      if (!location) {
        return this.emptyLabel
      }

      return `${location.locality}, ${location.country}`
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
        const location = getLocation(response[0], false)

        this.change(location)
      })
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
          this.loading = false

          const location = getLocation(response[5], true)
          this.change(location)
        }
      )
    },
  },
}
</script>
