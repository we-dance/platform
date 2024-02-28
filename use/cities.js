import Vue from 'vue'
import { watch, toRefs, computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useDoc } from '~/use/doc'
import { slugify } from '~/utils'
import { getLocality } from '~/use/google'

const state = Vue.observable({
  currentCity: ls('city'),
  isCreating: false,
})

export const useCities = () => {
  const { doc: city, id: cityId, exists, find, create, softUpdate } = useDoc(
    'profiles'
  )

  const currentCity = computed(() => state.currentCity || ls('city'))

  const cityName = computed(() => {
    return city.value?.name
  })

  if (currentCity.value) {
    find('cityPlaceId', currentCity.value)
  }

  watch(currentCity, (currentCity) => {
    ls('city', currentCity || '')

    if (currentCity) {
      find('cityPlaceId', currentCity)
    } else {
      city.value = {}
    }
  })

  async function ensureCity(placeId) {
    if (!placeId) {
      return
    }

    await find('cityPlaceId', placeId)

    if (!exists.value) {
      if (state.isCreating) {
        return
      }

      state.isCreating = true
      const location = await getLocality({ placeId })

      const name = location.locality || location.establishment
      const cityProfile = {
        username: slugify(location.country + '-' + name),
        name: name + ', ' + location.country,
        type: 'City',
        place: placeId,
        cityPlaceId: placeId,
        location,
      }

      await create(cityProfile)
      state.isCreating = false
    }

    if (cityId.value && !city.value.location?.latitude) {
      const location = await getLocality({ placeId })
      await softUpdate(cityId.value, {
        location,
      })
    }
  }

  async function switchCity(placeId) {
    await ensureCity(placeId)
    state.currentCity = placeId
  }

  return {
    ...toRefs(state),
    city,
    cityName,
    switchCity,
    ensureCity,
  }
}
