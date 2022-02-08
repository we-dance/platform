<template>
  <main>
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
    >
      <template v-slot:card-toolbar="{ item }">
        <button
          v-if="can('analytics', collection, item)"
          class="flex p-2 hover:text-primary"
          @click="
            peopleId !== item.id ? (peopleId = item.id) : (peopleId = false)
          "
        >
          <span v-if="item.recipients" class="mr-1">{{
            Object.keys(item.recipients).length
          }}</span>

          <TIcon
            name="people"
            :class="peopleId === item.id ? 'text-primary' : ''"
          />
        </button>
      </template>
      <template v-slot="{ item }">
        <TRecipients
          v-if="peopleId === item.id"
          :recipients="item.recipients"
          @close="peopleId = false"
        />

        <div class="mb-4 rounded border bg-white p-4">
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs font-bold">
                {{ item.name }}
              </div>
              <div class="text-sm">{{ item.from }}</div>
              <div class="font-bold">{{ item.subject }}</div>
            </div>
          </div>

          <TPopupEdit
            :fields="fields"
            label="Edit"
            show-remove
            :collection="collection"
            :item="item"
            class="mt-2"
          />
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import { useAuth } from '~/use/auth'

import { getDate, getDateTime, getTime } from '~/utils'

export default {
  middleware: ['auth'],
  data: () => ({
    data: '',
    peopleId: false,
  }),
  setup() {
    const { can } = useAuth()
    const title = 'Templates'
    const collection = 'templates'
    const add = 'Add'

    const fields = [
      {
        name: 'name',
        labelPosition: 'top',
      },
      {
        name: 'subject',
        labelPosition: 'top',
      },
      {
        name: 'from',
        labelPosition: 'top',
        component: 'TInputSelect',
        options: [
          {
            value: 'WeDance <automated@wedance.vip>',
            label: 'WeDance',
          },
          {
            value: 'Alex from WeDance <alex@wedance.vip>',
            label: 'Alex',
          },
        ],
      },
      {
        name: 'content',
        label: 'Content',
        labelPosition: 'top',
        component: 'TInputTextarea',
      },
    ]

    return {
      fields,
      title,
      collection,
      add,
      getDate,
      getDateTime,
      getTime,
      can,
    }
  },
}
</script>
