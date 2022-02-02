<template>
  <main>
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:card-toolbar="{ item }">
        <button
          v-if="can('analytics', collection, item)"
          class="p-2 hover:text-primary flex"
          @click="
            peopleId !== item.id ? (peopleId = item.id) : (peopleId = false)
          "
        >
          <span class="mr-1">{{ Object.keys(item.recipients).length }}</span>

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

        <div class="p-4 border rounded mb-4 bg-white">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex text-xs">
                <div class="mb-2 text-gray-500 mr-2">
                  <span class="font-bold">Created</span> at
                  {{ getDate(item.createdAt) }} at
                  {{ getTime(item.createdAt) }}
                </div>
                <div class="mb-2 text-gray-500">
                  <span class="font-bold">Scheduled</span> for
                  {{ getDate(item.scheduledAt) }} at
                  {{ getTime(item.scheduledAt) }}
                </div>
              </div>
              <div class="font-bold text-lg">
                {{ item.subject }}
              </div>
            </div>
            <div>
              <div
                class="text-xs text-white font-bold px-2 py-1 rounded-full"
                :class="emailStatusClass[item.status]"
              >
                {{ item.status }}
              </div>
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

          <div v-if="item.status === 'error'" class="text-red-500 text-xs">
            <span class="font-bold">Error:</span> {{ item.error }}
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import { useAuth } from '~/use/auth'

import {
  getDate,
  getDateTime,
  getTime,
  getDateObect,
  toDatetimeLocal,
} from '~/utils'

export default {
  middleware: ['auth'],
  data: () => ({
    data: '',
    peopleId: false,
    emailStatusClass: {
      draft: 'bg-orange-500',
      scheduled: 'bg-blue-500',
      sent: 'bg-green-500',
      canceled: 'bg-red-900',
      error: 'bg-red-500',
    },
  }),
  setup() {
    const { can } = useAuth()
    const title = 'Emails'
    const collection = 'emails'
    const add = 'Add'

    const filters = [
      {
        name: 'all',
        default: true,
        sort: '-createdAt',
      },
    ]

    const fields = [
      {
        name: 'subject',
      },
      {
        name: 'from',
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
        name: 'status',
        component: 'TInputSelect',
        defaultValue: 'draft',
        options: ['draft', 'scheduled', 'sent', 'canceled'],
      },
      {
        name: 'scheduledAt',
        type: 'datetime-local',
        set: (val) => {
          if (!val) return ''
          return new Date(val)
        },
        get: (val) => {
          if (!val) return ''
          return toDatetimeLocal(getDateObect(val))
        },
      },
      {
        name: 'recipients',
        component: 'TAccountListSelector',
      },
      {
        name: 'content',
        hideLabel: true,
        component: 'TInputTextarea',
      },
    ]

    return {
      filters,
      fields,
      title,
      collection,
      add,
      getDate,
      getTime,
      getDateTime,
      can,
    }
  },
}
</script>
