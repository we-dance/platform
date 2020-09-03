<template>
  <div>
    <div class="flex">
      <TInput v-model="input" :placeholder="searchPlaceholder" />
      <div class="flex justify-center items-center">
        <TIcon
          v-if="!gpsIsBlocked"
          :name="loading ? 'coffee' : 'gps_fixed'"
          class="h-4 w-4 ml-2 cursor-pointer"
          @click="requestBrowserLocation()"
        />
      </div>
    </div>

    <div v-if="predictions" class="border absolute bg-white rounded">
      <div
        v-for="prediction in predictions"
        :key="prediction.place_id"
        class="p-2 hover:bg-indigo-500 text-black hover:text-white cursor-pointer"
        @click="select(prediction.place_id)"
      >
        {{ prediction.description }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import { getLocation } from '~/utils'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.api.google,
    libraries: 'places'
  }
})

const gmapApi = VueGoogleMaps.gmapApi

export default {
  props: {
    value: {
      type: [Object, String],
      default: ''
    },
    autoSelect: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: 'Search city'
    }
  },

  data: () => ({
    input: '',
    predictions: [],
    gpsIsBlocked: false,
    loading: false
  }),

  computed: {
    google: gmapApi
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
          types: ['(cities)']
        },
        this.updateList
      )
    }
  },

  async mounted() {
    this.input = ''

    if (this.autoSelect) {
      this.requestBrowserLocation()
    }

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
            lng: position.coords.longitude
          }
        },
        (response, status) => {
          this.loading = false

          const location = getLocation(response[5], true)
          this.change(location)
        }
      )
    }
  }
}
</script>
