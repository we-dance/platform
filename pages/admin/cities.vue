<template>
  <div v-if="!isAdmin()" class="mt-4 mx-auto max-w-md p-4 text-sm text-center">
    Only admin can access this area.
  </div>
  <div v-else>
    <TCardList v-bind="config">
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
              <pre v-if="$route.query.debug">{{ item }}</pre>
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
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
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
    const { isAdmin } = useAuth()
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
          name: 'location',
          component: 'TInputLocation',
        },
        {
          name: 'hits',
        },
        {
          name: 'status',
          component: 'TInputSelect',
          options: ['requested', 'active'],
        },
        {
          name: 'ambassador',
          component: 'TInputProfile',
          label: 'Ambassador',
          labelPosition: 'top',
        },
        {
          name: 'instagram',
        },
        {
          name: 'instagramUsername',
        },
        {
          name: 'instagramPassword',
        },
        {
          name: 'telegram',
        },
        {
          name: 'telegramChannel',
        },
        {
          name: 'telegramChannelId',
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
      isAdmin,
    }
  },
}
</script>
