<template>
  <TCardList v-bind="config" class="mx-4">
    <template v-slot:default="{ item }">
      <div class="space-y-2 border rounded overflow-hidden">
        <div class="flex justify-between p-4 w-full">
          <div>
            <div class="font-bold text-xs text-red-500">
              {{ getDateTime(item.deletedAt) }}
            </div>
            <div><span class="font-bold">Reason:</span> {{ item.reason }}</div>
            <div>
              <span class="font-bold">Username:</span> {{ item.username }}
            </div>
            <div><span class="font-bold">Email:</span> {{ item.email }}</div>
            <template v-if="item.profile">
              <div>
                <span class="font-bold">UID:</span> {{ item.profile.createdBy }}
              </div>
              <div>
                <span class="font-bold">Objectives:</span>
                {{ item.profile.objectives }}
              </div>
              <div>
                <span class="font-bold">City:</span>
                {{ getCity(item.profile.place) }}
              </div>
              <div>
                <span class="font-bold">Usage:</span>
                {{ item.profile.daysUsed }} days
              </div>
            </template>

            <pre v-if="$route.query.debug">{{ item.profile }}</pre>
          </div>
        </div>

        <TSharePreviewPost
          v-if="item.profile"
          :type="item.profile.type"
          collection="profiles"
          :username="item.profile.username"
          :description="getExcerpt(item.profile.bio)"
          :photo="item.profile.photo"
          :styles="item.profile.styles"
          size="sm"
        />
      </div>
    </template>
  </TCardList>
</template>

<script>
import { useApp } from '~/use/app'
import { getOptionsFromArray, getExcerpt, getDateTime } from '~/utils'

export default {
  middleware: ['auth'],
  name: 'SuspendedIndex',
  setup() {
    const config = {
      collection: 'suspended',
      title: 'Suspended',
      empty: 'Nothing here',
      fields: getOptionsFromArray(['username', 'reason', 'email', 'deletedAt']),
      filters: [
        {
          name: 'all',
          default: true,
          sort: '-deletedAt',
        },
      ],
    }

    const { getCity } = useApp()

    return {
      config,
      getExcerpt,
      getDateTime,
      getCity,
    }
  },
}
</script>
