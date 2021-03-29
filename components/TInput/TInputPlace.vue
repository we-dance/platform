<template>
  <t-rich-select
    v-model="internalValue"
    :fetch-options="fetchOptions"
    :placeholder="isLocating ? 'Locating...' : placeholder"
    v-bind="$attrs"
  />
</template>

<script>
import { computed, onMounted, ref } from '@nuxtjs/composition-api'
import { useApp } from '~/use/app'
import { getPlacePredictions, getLocality, getUserAddress } from '~/use/google'
import { searchByStart, sortBy } from '~/utils'

export default {
  name: 'TInputPlace',
  props: {
    value: {
      type: [String, Object],
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
  setup(props, { emit }) {
    const { getCityHistory, addCityHistory, cities, cache } = useApp()

    const isLocating = ref(false)

    const setPlace = (address) => {
      emit('input', address)
      addCityHistory(address)
    }

    const onChange = async (placeId) => {
      if (!placeId) {
        setPlace('')
        return
      }

      isLocating.value = true

      let address

      if (cache.value.cities[placeId]) {
        address = cache.value.cities[placeId].location
      } else {
        address = await getLocality({ placeId })
      }

      isLocating.value = false

      setPlace(address)
    }

    const fetchOptions = async (q) => {
      let results = []

      if (!q) {
        const cityHistory = await getCityHistory()

        if (cityHistory) {
          results.push(...cityHistory)
        }
      } else {
        results = cities.value
          .filter(searchByStart('name', q))
          .sort(sortBy('name'))
      }

      results = results.map((c) => ({
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id
      }))

      if (q && results.length < 3) {
        const places = await getPlacePredictions(q)

        if (places.length) {
          results.push(
            ...places
              .map((i) => ({
                label: `${i.description} *`,
                value: i.place_id
              }))
              .filter((n) => !results.find((o) => n.value === o.value))
          )
        }
      }

      return { results }
    }

    onMounted(async () => {
      if (props.autoDetect) {
        isLocating.value = true

        const address = await getUserAddress()
        setPlace(address)

        isLocating.value = false
      }
    })

    const internalValue = computed({
      get() {
        if (!props.value?.place_id) {
          return ''
        }

        return props.value.place_id
      },
      set(val) {
        onChange(val)
      }
    })

    return {
      fetchOptions,
      onChange,
      isLocating,
      internalValue
    }
  }
}
</script>
