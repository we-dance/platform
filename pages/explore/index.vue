<template>
  <div>
    <THeader>
      <t-input v-model="query" placeholder="Search city" auto-focus />
    </THeader>

    <div v-if="!query">
      <router-link
        v-for="city in recommendations"
        :key="city.username"
        class="border-b block p-4 cursor-pointer hover:bg-red-100"
        :to="localePath(`/explore/${city.username}`)"
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
import firebase from 'firebase/app'
import 'firebase/firestore'
import { orderBy, uniqBy } from 'lodash'
import { computed, onMounted, ref, watch } from 'vue-demi'
import { useCities } from '~/use/cities'
import { useRouter } from '~/use/router'
import { getPlacePredictions } from '~/use/google'
import { useAuth } from '~/use/auth'

export default {
  setup(props, { root }) {
    const { switchCity, city } = useCities()
    const { router, route } = useRouter()
    const { updateProfile } = useAuth()

    const docs = ref([])

    async function changeCity(placeId) {
      await switchCity(placeId)
      await updateProfile({ current: placeId })
      const target = route.query.target || `/explore/${city.value.username}`
      router.push(target)
    }

    const query = ref(root.$route.query.q || '')

    watch(query, (q) => {
      history.pushState({}, null, root.$route.path + `?q=${q}`)
    })

    const recommendations = computed(() => {
      const results = uniqBy(
        orderBy(docs.value, 'viewsCount', 'desc').filter(
          (c) => c.username && c.viewsCount
        ),
        'username'
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

    watch(query, render)

    onMounted(async () => {
      const firestore = firebase.firestore()

      docs.value = (
        await firestore
          .collection('profiles')
          .where('type', '==', 'City')
          .orderBy('viewsCount', 'desc')
          .limit(10)
          .get()
      ).docs.map((doc) => doc.data())

      await render()
    })

    return {
      changeCity,
      query,
      results,
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
