<template>
  <div>
    <TCardList
      :collection="collection"
      title="Trips"
      add="Add a trip"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:empty>
        <div class="mt-4 mx-auto max-w-md p-4 text-sm">
          <TIcon name="undraw_travel_plans" class="p-4" />
          <div>
            Trips allow you to share dance-related travel plans with other users
            to find partners, travel companions, and new friends!
          </div>
          <div class="mt-2">
            Create a trip to let others see where you're going, or browse
            existing trips to see if you want to tag along.
          </div>
          <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
            <div>Sign in to continue</div>
            <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
          </div>
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
import { getDateTime } from '~/utils'
import { useAuth } from '~/use/auth'

export default {
  name: 'TripsIndex',
  setup() {
    const collection = 'trips'

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
        type: 'tags'
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
      filters,
      uid
    }
  }
}
</script>
