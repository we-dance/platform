<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot="{ item }">
        <div class="p-4 border rounded mb-4 bg-white">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-xs">Hits: {{ item.hits || 0 }}</div>
              <div class="font-bold text-lg">
                {{ item.name }}
              </div>
              <div>
                {{ item.location.country }} –
                <span class="text-xs font-mono bg-gray-200 p-1 rounded">{{
                  item.location.place_id
                }}</span>
              </div>
            </div>
            <div>
              <div
                class="text-xs text-white font-bold px-2 py-1 rounded-full"
                :class="cityStatusClass[item.status]"
              >
                {{ item.status }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'

import { getDate, getDateTime, getTime } from '~/utils'

export default {
  data: () => ({
    data: '',
    cityStatusClass: {
      active: 'bg-green-500',
      requested: 'bg-red-500'
    }
  }),
  setup() {
    const { can } = useAuth()
    const title = 'Cities'
    const collection = 'cities'
    const add = 'Add'

    const fields = [
      {
        name: 'name'
      },
      {
        name: 'telegram'
      },
      {
        name: 'location',
        type: 'location'
      },
      {
        name: 'hits'
      },
      {
        name: 'status',
        type: 'select',
        options: ['requested', 'active']
      }
    ]

    const filters = [
      {
        name: 'requested',
        label: 'Requested',
        default: true,
        filter: (item) => item.status === 'requested',
        sort: '-hits'
      },
      {
        name: 'active',
        label: 'Active',
        filter: (item) => item.status === 'active',
        sort: '-hits'
      }
    ]

    return {
      fields,
      filters,
      title,
      collection,
      add,
      getDate,
      getDateTime,
      getTime,
      can
    }
  }
}
</script>
