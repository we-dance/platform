import Vue from 'vue'
import { watch, toRefs, computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import useDoc from '~/use/doc'

const state = Vue.observable({
  currentCity: ls('city')
})

export default () => {
  const { doc: city, find } = useDoc('cities')

  const currentCity = computed(() => state.currentCity)

  find('name', currentCity.value)

  watch(currentCity, (currentCity) => {
    ls('city', currentCity)

    if (currentCity) {
      find('name', currentCity)
    } else {
      city.value = {}
    }
  })

  return {
    ...toRefs(state),
    city
  }
}
