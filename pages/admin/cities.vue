<template>
  <TCardList v-bind="config">
    <template v-slot="{ item }">
      <div class="mb-4 rounded border bg-white p-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs">Hits: {{ item.hits || 0 }}</div>
            <div class="text-lg font-bold">
              {{ item.name }}
            </div>
            <div>
              {{ item.location.country }} –
              <span class="rounded bg-gray-200 p-1 font-mono text-xs">{{
                item.location.place_id
              }}</span>
            </div>
            <pre v-if="$route.query.debug">{{ item }}</pre>
          </div>
          <div>
            <div
              class="rounded-full px-2 py-1 text-xs font-bold text-white"
              :class="cityStatusClass[item.status]"
            >
              {{ item.status }}
            </div>
          </div>
        </div>

        <TPopupEdit
          :fields="config.fields"
          label="Edit"
          show-remove
          :collection="config.collection"
          :item="item"
          class="mt-2"
        />
      </div>
    </template>
  </TCardList>
</template>

<script>
import { getDate, getDateTime, getTime } from '~/utils'

export default {
  middleware: ['auth'],
  data: () => ({
    cityStatusClass: {
      active: 'bg-green-500',
      requested: 'bg-red-500',
    },
  }),
  setup() {
    const config = {
      collection: 'cities',
      title: 'Communities',
      empty: 'Nothing here',
      add: 'Add',
      fields: [
        {
          name: 'name',
        },
        {
          name: 'telegram',
        },
        {
          name: 'location',
          component: 'TInputPlace',
        },
        {
          name: 'hits',
        },
        {
          name: 'status',
          component: 'TInputSelect',
          options: ['requested', 'active'],
        },
      ],
      filters: [
        {
          name: 'requested',
          label: 'Requested',
          default: true,
          filter: (item) => item.status === 'requested',
          sort: '-hits',
        },
        {
          name: 'active',
          label: 'Active',
          filter: (item) => item.status === 'active',
          sort: '-hits',
        },
      ],
    }

    return {
      config,
      getDate,
      getDateTime,
      getTime,
    }
  },
}
</script>
