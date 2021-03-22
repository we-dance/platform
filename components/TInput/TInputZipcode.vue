<template>
  <div>
    <t-rich-select
      v-model="internalValue"
      :fetch-options="fetchOptions"
      :placeholder="isLocating || isUpdating ? 'Locating...' : placeholder"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useApp } from '~/use/app'
import { getBrowserLocation } from '~/use/geo'
import { getAddress, getGeoCode, getPlacePredictions } from '~/use/google'

export default {
  name: 'TInputZipcode',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Zipcode'
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
  mounted() {
    this.requestBrowserLocation()
  },
  setup(props, { emit }) {
    const { readAll } = useApp()

    const cities = ref(null)
    const places = ref(null)
    const isLocating = ref(false)
    const isUpdating = ref(false)

    const checkCommunity = (address) => {
      const exists = !!cities.value[address.place_id]
      if (exists) {
        console.log(`Community ${address.locality} exists`)
      } else {
        console.log(`Adding ${address.locality} community`)
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

      emit('input', address.place_id)
      checkCommunity(address)
    }

    const onChange = async (placeId) => {
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
      checkCommunity(address)
    }

    const fetchOptions = async (q) => {
      if (!cities.value) {
        cities.value = await readAll('cities')
      }

      places.value = []
      let results = []

      try {
        places.value = await getPlacePredictions(q, ['(regions)'])

        if (places.value.length) {
          results = places.value.map((i) => ({
            label: i.description,
            value: i.place_id
          }))
        }
      } catch (e) {
        console.log('error', e)
      }

      return { results }
    }

    return {
      fetchOptions,
      onChange,
      requestBrowserLocation,
      isLocating,
      isUpdating
    }
  }
}
</script>
