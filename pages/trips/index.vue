<template>
  <div class="flex-grow p-4 bg-gray-200 rounded mr-4">
    <TCardList
      :collection="collection"
      title="Trips"
      add="Add a trip"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          Create your first trip.
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="rounded bg-white mb-4 shadow border p-4">
          <router-link
            :to="`/trips/${item.id}`"
            class="underline hover:no-underline"
          >
            {{ getDateTime(item.start) }} to {{ item.event }}
          </router-link>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import TFieldTag from '~/components/TFieldTag'
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'

export default {
  name: 'TripsIndex',
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

    const { uid } = useAuth()

    const filters = [
      {
        name: 'mine',
        default: true,
        filter: (item) => item.createdBy === uid.value
      }
    ]

    return {
      collection,
      fields,
      getDateTime,
      filters
    }
  }
}
</script>
