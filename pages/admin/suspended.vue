<template>
  <TCardList v-bind="config" class="max-w-md">
    <template v-slot:default="{ item }">
      <div class="space-y-2 border rounded overflow-hidden">
        <div class="flex justify-between p-4">
          <div>
            <div class="font-bold text-lg">{{ item.reason }}</div>
            <div>{{ item.username }} • {{ item.email }}</div>
            <div v-if="item.profile" class="text-sm text-gray-700">
              {{ getCity(item.profile.place) }} •
              {{ item.profile.daysUsed }} days used
            </div>
            <pre v-if="$route.query.debug">{{ item.profile }}</pre>
          </div>
          <div>{{ getDateTimeYear(item.deletedAt) }}</div>
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
import { getOptionsFromArray, getExcerpt, getDateTimeYear } from '~/utils'

export default {
  middleware: ['auth'],
  name: 'SuspendedIndex',
  setup() {
    const config = {
      collection: 'suspended',
      title: 'Suspended',
      empty: 'Nothing here',
      fields: getOptionsFromArray(['username', 'reason', 'email', 'deletedAt'])
    }

    const { getCity } = useApp()

    return {
      config,
      getExcerpt,
      getDateTimeYear,
      getCity
    }
  }
}
</script>
