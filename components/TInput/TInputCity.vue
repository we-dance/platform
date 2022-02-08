<template>
  <div>
    <div class="relative inline-block w-full cursor-pointer">
      <div
        class="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none"
        @click="showPopup = true"
      >
        <div v-if="!loading || gpsIsBlocked" class="flex text-sm">
          {{ getLabel(value) }}
          <span
            v-if="gpsIsBlocked"
            class="h-2 w-2 rounded-full bg-red-500"
          ></span>
        </div>
        <div v-else>Locating...</div>
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg
          class="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
          />
        </svg>
      </div>
    </div>

    <TPopup v-if="showPopup" :title="popupTitle" @close="showPopup = false">
      <div class="flex">
        <TInput
          v-model="input"
          :placeholder="searchPlaceholder"
          @click.native="focused = true"
        />
      </div>

      <div class="h-64 max-w-md overflow-y-scroll">
        <div
          v-if="!hideGlobal"
          class="flex cursor-pointer items-center p-2 text-black hover:bg-indigo-500 hover:text-white"
          @click="change('')"
        >
          <span>{{ globalLabel }}</span>
        </div>
        <div v-if="predictions.length">
          <div
            v-for="prediction in predictions"
            :key="prediction.place_id"
            class="cursor-pointer p-2 text-left text-black hover:bg-indigo-500 hover:text-white"
            @click="select(prediction.place_id)"
          >
            {{ prediction.description }}
          </div>
        </div>
        <div v-else>
          <div
            v-for="city in cities"
            :key="city.name"
            class="cursor-pointer p-2 text-left text-black hover:bg-indigo-500 hover:text-white"
            @click="change(city.name)"
          >
            {{ city.name }}, {{ city.location.country }}
          </div>
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import { computed } from '@nuxtjs/composition-api'
import { getLocation, sanitize, sortBy } from '~/utils'
import { useDoc } from '~/use/doc'
import { useCollection } from '~/use/collection'
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
  name: 'TInputCity',
  setup() {
    const { find, create, id, update, doc } = useDoc('cities')
    const { docs } = useCollection('cities')
    const cities = computed(() =>
      docs.value.filter((city) => city.status === 'active').sort(sortBy('name'))
    )

    return {
      find,
      create,
      update,
      id,
      doc,
      cities,
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
    hideGlobal: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: 'Search city',
    },
    globalLabel: {
      type: String,
      default: 'Anywhere',
    },
    emptyLabel: {
      type: String,
      default: 'Anywhere',
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
    focused: false,
  }),

  computed: {
    google: gmapApi,
  },

  watch: {
    value(val) {
      this.input = ''
    },

    showPopup: 'reset',

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
    this.reset()

    await this.$gmapApiPromiseLazy()

    if (this.autoSelect && !this.value) {
      this.requestBrowserLocation()
    }
  },

  methods: {
    reset() {
      this.input = ''
      this.focused = false
      this.predictions = []
    },
    locate() {
      this.showPopup = false
      this.requestBrowserLocation()
    },
    open() {
      this.predictions = []
      this.showPopup = true
    },
    getLabel(city) {
      if (!city) {
        return this.emptyLabel
      }

      return city
    },
    change(city) {
      this.showPopup = false
      this.$emit('input', city)
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
      geocoder.geocode({ placeId }, (response, status) => {
        const location = getLocation(response[0], false)
        this.selectLocation(location)
      })
    },

    async selectLocation(location) {
      if (!location) {
        return
      }

      await this.find('location.place_id', location.place_id)

      let cityName

      if (!this.id) {
        cityName = sanitize(location.locality, ' ')

        this.create({
          name: cityName,
          location,
          status: 'requested',
          hits: 1,
        })
      } else {
        cityName = this.doc.name

        this.update(this.id, {
          hits: parseInt(this.doc.hits || 0) + 1,
        })
      }

      this.change(cityName)
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
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        },
        (response, status) => {
          this.loading = false

          const location = getLocation(response[5], true)
          this.selectLocation(location)
        }
      )
    },
  },
}
</script>
