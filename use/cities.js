import Vue from 'vue'
import { watch, toRefs, computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useDoc } from '~/use/doc'

const state = Vue.observable({
  currentCity: ls('city'),
})

export const useCities = () => {
  const { doc: city, find } = useDoc('cities')

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

  return {
    ...toRefs(state),
    city,
    cityName,
    changeCityByName,
  }
}
