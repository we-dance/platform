<template>
  <t-rich-select
    v-model="internalValue"
    :fetch-options="fetchOptions"
    :placeholder="isLocating ? 'Locating...' : placeholder"
    v-bind="$attrs"
  />
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { getPlacePredictions } from '~/use/google'
import { useCities } from '~/use/cities'
import { useDoc } from '~/use/doc'

export default {
  name: 'TInputPlace',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Search city',
    },
    autoDetect: {
      type: Boolean,
      default: false,
    },
    global: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { doc: city, find } = useDoc('profiles')
    const { ensureCity } = useCities()
    const isLocating = ref(false)

    const setPlace = (placeId) => {
      emit('input', placeId)
    }

    const onChange = async (placeId) => {
      if (!placeId) {
        setPlace('')
        return
      }

      isLocating.value = true
      await ensureCity(placeId)
      isLocating.value = false
      setPlace(placeId)
    }

    const fetchOptions = async (q) => {
      const results = []

      if (props.global) {
        results.push({
          label: 'Global',
          value: '',
        })
      }

      if (!q) {
        await find('cityPlaceId', props.value)

        if (city.value?.name) {
          results.push({
            label: city.value.name,
            value: city.value.cityPlaceId,
          })
        }
      }

      if (q) {
        const places = await getPlacePredictions(q)

        if (places.length) {
          results.push(
            ...places.map((i) => ({
              label: i.description,
              value: i.place_id,
            }))
          )
        }
      }

      return { results }
    }

    const internalValue = computed({
      get() {
        return props.value
      },
      set(val) {
        onChange(val)
      },
    })

    return {
      fetchOptions,
      onChange,
      isLocating,
      internalValue,
    }
  },
}
</script>
