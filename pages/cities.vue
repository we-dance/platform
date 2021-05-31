<template>
  <div>
    <THeader title="Choose city" />

    <div class="text-xs font-bold p-4">Saved cities</div>
    <div
      v-for="city in cities"
      :key="city.value"
      class="border-b p-4 text-lg cursor-pointer hover:bg-red-100"
      @click="changeCity(city.value)"
    >
      {{ city.name }}
    </div>

    <div class="text-xs font-bold p-4">Add new city</div>
    <div class="px-4">
      <TInputPlace v-model="currentCity" clearable />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'
import { useApp } from '~/use/app'
import { useRouter } from '~/use/router'

export default {
  setup() {
    const { currentCity } = useCities()
    const { profile } = useAuth()
    const { getCity } = useApp()
    const { router } = useRouter()

    const cities = computed(() => {
      if (!profile.value || !profile.value.cities) {
        return []
      }

      return Object.keys(profile.value.cities)
        .map((city) => ({ name: getCity(city), value: city }))
        .filter((c) => c.name)
    })

    function changeCity(placeId) {
      currentCity.value = placeId
      router.push('/feed')
    }

    return { currentCity, cities, changeCity }
  }
}
</script>
