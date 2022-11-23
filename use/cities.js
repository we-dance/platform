import Vue from 'vue'
import { watch, toRefs, computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useDoc } from '~/use/doc'
import { sanitize } from '~/utils'
import { getLocality } from '~/use/google'

const state = Vue.observable({
  currentCity: ls('city'),
})

export const useCities = () => {
  const { doc: city, exists, find, create } = useDoc('cities')

  const currentCity = computed(() => state.currentCity || ls('city'))

  const cityName = computed(() => {
    return city.value?.name
  })

  find('location.place_id', currentCity.value)

  watch(currentCity, (currentCity) => {
    ls('city', currentCity || '')

    if (currentCity) {
      find('location.place_id', currentCity)
    } else {
      city.value = {}
    }
  })

  async function changeCityByName(cityName) {
    await find('name', cityName)

    state.currentCity = city.value?.location?.place_id || ''
  }

  async function switchCity(placeId) {
    await find('location.place_id', placeId)

    if (!exists.value) {
      const location = await getLocality({ placeId })
      const cityName = sanitize(location.locality, ' ')

      await create({
        name: cityName,
        location,
        status: 'requested',
        hits: 1,
      })
    }

    state.currentCity = placeId
  }

  return {
    ...toRefs(state),
    city,
    cityName,
    changeCityByName,
    switchCity,
  }
}
