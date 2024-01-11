<template>
  <div>
    <div class="bg-gray-200 p-2 pl-12 md:pl-2">
      <TInput
        v-model="query"
        auto-focus
        placeholder="Search profiles and events"
        class="rounded-full"
        @input="search"
      />
    </div>
    <NuxtLink
      v-for="item in response.hits"
      :key="item.id"
      :to="localePath(`/${item.username}`)"
      class="border-b p-4 flex items-center hover:bg-blue-200"
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
    <div class="font-bold p-4 border-b">Upcoming Events</div>
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
    />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useAlgolia } from '~/use/algolia'
import { getDateObect } from '~/utils'

export default {
  setup() {
    const query = ref('')
    const { search: searchProfiles, response } = useAlgolia('profiles')
    const { search: searchEvents, response: responseEvents } = useAlgolia(
      'events'
    )

    let today = new Date(Date.now())
    today.setHours(6, 0, 0, 0)
    today = +today
    const fromDate = ref(today)

    async function search() {
      await searchProfiles(query.value)

      const searchParams = {
        filters: `startDate>${fromDate.value}`,
      }
      await searchEvents(query.value, searchParams)
    }

    return { query, search, response, responseEvents, getDateObect }
  },
  mounted() {
    this.search()
  },
}
</script>
