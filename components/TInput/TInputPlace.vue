<template>
  <t-rich-select
    v-model="internalValue"
    :fetch-options="fetchOptions"
    :placeholder="isLocating || isUpdating ? 'Locating...' : placeholder"
  />
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useApp } from '~/use/app'
import { getBrowserLocation } from '~/use/geo'
import { getAddress, getGeoCode, getPlacePredictions } from '~/use/google'
import { getArrayFromHash, searchByStart, sortBy } from '~/utils'

export default {
  name: 'TInputPlace',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'City'
    },
    autoDetect: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      async set(val) {
        await this.onChange(val)
      }
    }
  },
  setup(props, { emit }) {
    const { readAll } = useApp()

    const cities = ref(null)
    const places = ref(null)
    const shownResults = ref(null)
    const isLocating = ref(false)
    const isUpdating = ref(false)

    const communityExists = (placeId) => {
      return !!cities.value[placeId]
    }

    const addCommunity = (address) => {
      console.log(`Adding ${address.locality} community`)
    }

    const requestBrowserLocation = async () => {
      isLocating.value = true

      const location = await getBrowserLocation()
      const lat = location.coords.latitude
      const lng = location.coords.longitude
      const results = await getGeoCode({ location: { lat, lng } })
      const address = getAddress(results)

      isLocating.value = false

      emit('input', address.place_id)

      if (!communityExists(address.place_id)) {
        addCommunity(address)
      }
    }

    const onChange = async (placeId) => {
      if (communityExists(placeId)) {
        emit('input', placeId)
        return
      }

      isUpdating.value = true

      let results = await getGeoCode({ placeId })
      let address

      if (!results.find((p) => p.types.includes('locality'))) {
        address = getAddress(results)
        results = await getGeoCode({
          address: `${address.locality}, ${address.country}`
        })
      }

      address = getAddress(results)

      isUpdating.value = false

      emit('input', address.place_id)

      if (!communityExists(address.place_id)) {
        addCommunity(address)
      }
    }

    const fetchOptions = async (q) => {
      if (!cities.value) {
        cities.value = await readAll('cities')
      }

      places.value = []

      const citiesArray = getArrayFromHash(cities.value)

      let results = []

      results = citiesArray

      results = results.filter(searchByStart('name', q)).sort(sortBy('name'))

      results = results.map((c) => ({
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id
      }))

      if (!results.length) {
        places.value = await getPlacePredictions(q)

        if (places.value.length) {
          results = places.value.map((i) => ({
            label: i.description,
            value: i.place_id
          }))
        }
      }

      shownResults.value = results

      return { results }
    }

    onMounted(() => {
      if (props.autoDetect) {
        requestBrowserLocation()
      }
    })

    return {
      fetchOptions,
      onChange,
      requestBrowserLocation,
      isLocating,
      isUpdating,
      shownResults,
      places
    }
  }
}
</script>
