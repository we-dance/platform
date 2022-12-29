<template>
  <div>
    <THeader>
      <t-input v-model="query" placeholder="Search city" />
    </THeader>

    <div v-if="!query">
      <router-link
        v-for="city in recommendations"
        :key="city.username"
        class="border-b block p-4 cursor-pointer hover:bg-red-100"
        :to="`/${city.username}`"
      >
        <div class="text-lg">
          {{ city.name }}
        </div>
        <div class="flex space-x-2 items-center">
          <div class="text-xs">{{ city.viewsCount }} views</div>
          <div
            v-if="city.website"
            class="rounded-full w-2 h-2 bg-green-500"
          ></div>
        </div>
      </router-link>
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
import { orderBy } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue-demi'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { useApp } from '~/use/app'
import { getPlacePredictions } from '~/use/google'
import { useAuth } from '~/use/auth'
import { useCollection } from '~/use/collection'

export default {
  setup() {
    const { switchCity, city } = useCities()
    const { router, route } = useRouter()
    const { updateProfile } = useAuth()
    const { removeCityHistory: removeCity, cities } = useApp()
    const { docs, load } = useCollection('profiles', { type: 'City' })

    async function changeCity(placeId) {
      await switchCity(placeId)
      await updateProfile({ current: placeId })
      const target = route.query.target || `/${city.value.username}`
      router.push(target)
    }

    const query = ref('')

    const recommendations = computed(() => {
      const results = orderBy(docs.value, 'viewsCount', 'desc').filter(
        (c) => c.username
      )

      return results
    })

    const fetchOptions = async (q) => {
      const results = []

      if (!q) {
        return { results }
      }

      const places = await getPlacePredictions(q)

      if (places.length) {
        results.push(
          ...places.map((i) => ({
            label: `${i.description}`,
            value: i.place_id,
          }))
        )
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
