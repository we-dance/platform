<template>
  <TCardList v-bind="config" class="mx-4">
    <template v-slot:default="{ item }">
      <div class="space-y-2 border rounded overflow-hidden p-4">
        <TAvatar :uid="item.createdBy" name photo />
        <div class="font-bold text-xs text-red-500">
          {{ getDateTime(item.createdAt) }}
        </div>
        <div>
          <span class="font-bold">Where:</span> {{ getCity(item.where) }}
        </div>
        <div><span class="font-bold">When:</span> {{ item.when }}</div>
        <TStyles
          :value="item.styles"
          hide-level
          class="flex flex-wrap justify-left items-center border-b px-4 py-2 text-xs"
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
  name: 'SubscribersIndex',
  setup() {
    const config = {
      collection: 'subscribers',
      title: 'Subscribers',
      empty: 'Nothing here',
      fields: getOptionsFromArray(['where', 'when', 'styles', 'createdAt']),
      filters: [
        {
          name: 'all',
          default: true,
          sort: '-createdAt',
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
