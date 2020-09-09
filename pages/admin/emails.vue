<template>
  <main class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="fields"
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
        <TPopup
          v-if="peopleId === item.id"
          :title="`Recipients of ${item.name}`"
          class="p-4 border rounded mb-4"
          @close="peopleId = false"
        >
          <div
            v-for="(recipient, uid) in item.recipients"
            :key="uid"
            class="flex items-center"
          >
            <div class="mr-4">
              <div>{{ recipient.name }}</div>
              <div class="text-sm text-gray-500">{{ recipient.email }}</div>
            </div>
            <div class="flex">
              <div v-for="(styles, field) in states" :key="field">
                <div
                  v-if="recipient[field]"
                  :class="styles"
                  :title="field + ' ' + getDateTime(recipient[field])"
                  class="rounded-full w-4 h-4 mr-2"
                ></div>
              </div>
            </div>
          </div>
        </TPopup>

        <div class="p-4 border rounded mb-4 bg-real-white">
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
              <div class="mb-2 text-gray-500 text-xs">{{ item.name }}</div>
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

          <div v-if="item.status === 'error'" class="text-red-500 text-xs">
            <span class="font-bold">Error:</span> {{ item.error }}
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAuth from '~/use/auth'

import {
  getDate,
  getDateTime,
  getTime,
  getDateObect,
  toDatetimeLocal
} from '~/utils'

export default {
  data: () => ({
    data: '',
    peopleId: false,
    states: {
      deliveredAt: 'bg-green-500',
      openedAt: 'bg-green-500',
      clickedAt: 'bg-green-500',
      failedAt: 'bg-red-500',
      spammedAt: 'bg-orange-500',
      unsubscribedAt: 'bg-orange-500'
    },
    emailStatusClass: {
      draft: 'bg-orange-500',
      scheduled: 'bg-blue-500',
      sent: 'bg-green-500',
      canceled: 'bg-red-900',
      error: 'bg-red-500'
    }
  }),
  setup() {
    const { can } = useAuth()
    const title = 'Emails'
    const collection = 'emails'
    const add = 'Add'

    const fields = [
      {
        name: 'name'
      },
      {
        name: 'subject'
      },
      {
        name: 'from',
        defaultValue: 'WeDance <automated@wedance.vip>'
      },
      {
        name: 'status',
        type: 'select',
        defaultValue: 'draft',
        options: ['draft', 'scheduled', 'sent', 'canceled']
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
        }
      },
      {
        name: 'recipients',
        type: 'accounts'
      },
      {
        name: 'content',
        hideLabel: true,
        type: 'textarea'
      }
    ]

    return {
      fields,
      title,
      collection,
      add,
      getDate,
      getTime,
      getDateTime,
      can
    }
  }
}
</script>
