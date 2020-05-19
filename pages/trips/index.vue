<template>
  <div class="p-4 max-w-lg mx-auto">
    <TCardList
      :collection="collection"
      title="Trips"
      add="Add a trip"
      :fields="fields"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          Create your first trip.
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="card-item border p-4">
          <router-link
            :to="`/endorsements/${item.id}`"
            class="underline hover:no-underline"
            >{{ item.event }} on {{ getDateTime(item.when) }}</router-link
          >
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import TCardList from '~/components/TCardList'
import TFieldTag from '~/components/TFieldTag'
import { getDateTime } from '~/utils'

export default {
  name: 'TripsIndex',
  components: {
    TCardList
  },
  setup() {
    const collection = 'events'

    const fields = [
      {
        name: 'event',
        label: 'Name of the event'
      },
      {
        name: 'url',
        label: 'URL'
      },
      {
        name: 'eventDate',
        label: 'Date of the event',
        type: 'datetime-local'
      },
      {
        name: 'to',
        label: 'Location of the event'
      },
      {
        name: 'from',
        label: 'Where are you traveling from?'
      },
      {
        name: 'start',
        label: 'When do you want to start a trip?',
        type: 'datetime-local'
      },
      {
        name: 'genre',
        label: 'Genres',
        component: TFieldTag
      },
      {
        name: 'car',
        label: 'Do you have a car?',
        type: 'select',
        options: ['yes', 'no']
      }
    ]

    return {
      collection,
      fields,
      getDateTime
    }
  }
}
</script>
