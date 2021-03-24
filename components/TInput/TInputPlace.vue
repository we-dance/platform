<template>
  <t-rich-select
    v-model="internalValue"
    :fetch-options="fetchOptions"
    :placeholder="isLocating || isUpdating ? 'Locating...' : placeholder"
    v-bind="$attrs"
  />
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { when } from '@vueuse/shared'
import { useApp } from '~/use/app'
import { getBrowserLocation } from '~/use/geo'
import { getAddress, getGeoCode, getPlacePredictions } from '~/use/google'
import { getArrayFromHash, searchByStart, sortBy } from '~/utils'
import useAuth from '~/use/auth'

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
    },
    propertyKey: {
      type: String,
      default: 'place_id'
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      async set(val) {
        if (!val) {
          this.$emit('input', '')
          return
        }

        await this.onChange(val)
      }
    }
  },
  setup(props, { emit }) {
    const { readAll } = useApp()
    const { uid, profile, updateProfile } = useAuth()

    const cities = ref(null)
    const places = ref(null)
    const isLocating = ref(false)
    const isUpdating = ref(false)

    const communityExists = (placeId) => {
      return !!cities.value[placeId]
    }

    const addCommunity = (address) => {
      console.log(`Adding ${address.locality} community`)
    }

    const setPlace = (placeId, address) => {
      emit('input', placeId)

      if (!placeId) {
        return
      }

      if (
        uid.value &&
        (!profile.value.cities || !profile.value.cities[placeId])
      ) {
        updateProfile({
          [`cities.${placeId}`]: true
        })
      }

      if (!communityExists(placeId) && address) {
        addCommunity(address)
      }
    }

    const requestBrowserLocation = async () => {
      isLocating.value = true

      const location = await getBrowserLocation()
      const lat = location.coords.latitude
      const lng = location.coords.longitude
      const results = await getGeoCode({ location: { lat, lng } })
      const address = getAddress(results)

      isLocating.value = false

      setPlace(address.place_id, address)
    }

    const onChange = async (placeId) => {
      if (communityExists(placeId)) {
        setPlace(placeId)
        return
      }

      if (!placeId) {
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

      setPlace(address.place_id, address)
    }

    const fetchOptions = async (q) => {
      if (!cities.value) {
        cities.value = await readAll('cities')
      }

      if (uid.value) {
        await when(profile).not.toBeNull()
      }

      places.value = []
      let results = []

      const citiesArray = getArrayFromHash(cities.value)

      if (!q && profile.value && profile.value.cities) {
        const favCities = profile.value.cities
        results = citiesArray.filter(
          (c) =>
            favCities[c.location.place_id] ||
            c.location.place_id === props.value
        )
      } else {
        results = citiesArray
          .filter(searchByStart('name', q))
          .sort(sortBy('name'))
      }

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
      places,
      profile
    }
  }
}
</script>
