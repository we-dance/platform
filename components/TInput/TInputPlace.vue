<template>
  <t-rich-select
    v-model="internalValue"
    :fetch-options="fetchOptions"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useApp } from '~/use/app'
import { getPlacePredictions } from '~/use/google'
import { getArrayFromHash, searchBy, sortBy } from '~/utils'

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
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        const exists = !!this.cities[val]
        console.log(val, exists)

        this.$emit('input', val)
      }
    }
  },
  setup() {
    const { readAll } = useApp()
    const cities = ref(null)

    const fetchOptions = async (q) => {
      if (!cities.value) {
        cities.value = await readAll('cities')
      }

      let results = getArrayFromHash(cities.value).map((c) => ({
        ...c,
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id
      }))

      results = results.filter(searchBy('label', q))

      if (!q) {
        results = results.sort(sortBy('-hits'))
      } else {
        results = results.sort(sortBy('label'))
      }

      results = results.slice(0, 5)

      if (!results.length) {
        const places = await getPlacePredictions(q)
        results = places.map((i) => ({
          label: i.description,
          value: i.place_id
        }))
      }

      return {
        results
      }
    }

    return {
      fetchOptions,
      cities
    }
  }
}
</script>
