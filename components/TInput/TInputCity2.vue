<template>
  <t-rich-select
    v-model="internalValue"
    :fetch-options="fetchOptions"
    v-bind="$attrs"
  />
</template>

<script>
import { useApp } from '~/use/app'
import { getPlacePredictions } from '~/use/google'

export default {
  name: 'TInputCity2',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  setup() {
    const fetchOptions = async (q) => {
      const { getCities } = useApp()

      let results = await getCities(q)

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
      fetchOptions
    }
  }
}
</script>
