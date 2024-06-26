<template>
  <div>
    <TInput
      v-model="query"
      auto-focus
      placeholder="Search profiles and events"
      @input="search"
    />

    <div class="text-xs p-4 border-b">
      Searching a city?
      <NuxtLink
        class="underline hover:no-underline font-bold"
        :to="`/explore?q=${query}`"
        @click.native="$track('search_city', { label: query })"
        >Choose City</NuxtLink
      >
    </div>

    <NuxtLink
      v-for="item in response.hits"
      :key="item.id"
      :to="
        $route.query.debug || item.username.includes('/')
          ? localePath(`/id@${item.id}`)
          : localePath(`/${item.username}`)
      "
      class="border-b p-4 flex items-center hover:bg-blue-200"
      @click.native="
        $track('search_profile', {
          name: item.name,
          username: item.username,
          query,
        })
      "
    >
      <div class="w-12 flex-shrink-0">
        <TProfilePhoto2 size="sm" :src="item.photo" />
      </div>
      <div class="flex-grow">
        <div class="block leading-tight">{{ item.name }}</div>
        <div class="block text-xs leading-tight">
          {{ item.type }} • @{{ item.username }}
        </div>
      </div>
    </NuxtLink>
    <div
      v-if="responseEvents.hits && responseEvents.hits.length"
      class="font-bold p-4 border-b"
    >
      Upcoming Events
    </div>
    <TEventText4
      v-for="item in responseEvents.hits"
      :id="item.id"
      :key="item.id"
      class="hover:opacity-75"
      :name="item.name"
      :cover="item.cover"
      :venue="item.venue"
      :price="item.price"
      :start-date="getDateObect(item.startDate)"
      :event-type="item.type"
      :styles="item.styles"
      :organiser="item.organizer"
      show-date
      @click.native="$track('search_event', { name: item.name, query })"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue-demi'
import { useAlgolia } from '~/use/algolia'
import { getDateObect } from '~/utils'

export default {
  setup(props, { root }) {
    const query = ref(root.$route.query.q || '')

    watch(query, (q) => {
      history.pushState({}, null, root.$route.path + `?q=${q}`)
    })

    const { search: searchProfiles, response } = useAlgolia('profiles')
    const { search: searchEvents, response: responseEvents } = useAlgolia(
      'events'
    )

    let today = new Date(Date.now())
    today.setHours(6, 0, 0, 0)
    today = +today
    const fromDate = ref(today)

    async function search() {
      if (!query.value) {
        return
      }

      await searchProfiles(query.value)

      const searchParams = {
        filters: `startDate>${fromDate.value}`,
      }
      await searchEvents(query.value, searchParams)
    }

    return { query, search, response, responseEvents, getDateObect }
  },
}
</script>
