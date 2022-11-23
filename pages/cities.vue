<template>
  <div>
    <THeader>
      <t-input v-model="query" placeholder="Search city" />
    </THeader>

    <div v-if="!query">
      <div
        v-for="city in recommendations"
        :key="city.value"
        class="border-b flex"
      >
        <div
          class="flex-grow text-lg p-4 cursor-pointer hover:bg-red-100"
          @click="changeCity(city.value)"
        >
          {{ city.label }}
        </div>
      </div>
    </div>
    <div v-if="query">
      <div v-for="city in results" :key="city.value" class="border-b flex">
        <div
          class="flex-grow text-lg p-4 cursor-pointer hover:bg-red-100"
          @click="changeCity(city.value)"
        >
          {{ city.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue-demi'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { useApp } from '~/use/app'
import { getPlacePredictions } from '~/use/google'
import { searchByStart, sortBy } from '~/utils'
import { useAuth } from '~/use/auth'
import { useCollection } from '~/use/collection'

export default {
  setup() {
    const { switchCity } = useCities()
    const { router, route } = useRouter()
    const { updateProfile } = useAuth()
    const { removeCityHistory: removeCity, cities } = useApp()
    const { docs, load } = useCollection('cities')

    async function changeCity(placeId) {
      await switchCity(placeId)
      await updateProfile({ current: placeId })
      const target = route.query.target || '/events'
      router.push(target)
    }

    const query = ref('')

    const recommendations = computed(() => {
      let results = docs.value.sort(sortBy('-hits'))

      results = results.map((c) => ({
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id,
      }))

      return results
    })

    const fetchOptions = async (q) => {
      let results = []

      if (q) {
        results = cities.value.filter(searchByStart('name', q))
      }

      results = results.map((c) => ({
        label: `${c.location.locality}, ${c.location.country}`,
        value: c.location.place_id,
      }))

      results = results.sort(sortBy('label'))

      if (q && results.length < 3) {
        const places = await getPlacePredictions(q)

        if (places.length) {
          results.push(
            ...places
              .map((i) => ({
                label: `${i.description} *`,
                value: i.place_id,
              }))
              .filter((n) => !results.find((o) => n.value === o.value))
          )
        }
      }

      return { results }
    }

    const results = ref([])

    async function render() {
      const res = await fetchOptions(query.value)

      results.value = res.results
    }

    async function removeCityHistory(placeId) {
      await removeCity(placeId)
      await render()
    }

    watch(query, render)

    onMounted(async () => {
      await load()
      await render()
    })

    return {
      cities,
      changeCity,
      query,
      results,
      removeCityHistory,
      recommendations,
    }
  },
  head() {
    return {
      title: 'WeDance Cities',
    }
  },
}
</script>
