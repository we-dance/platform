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
              <div class="font-bold text-xs">
                {{ item.name }}
              </div>
              <div class="text-sm">{{ item.from }}</div>
              <div class="font-bold">{{ item.subject }}</div>
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
    peopleId: false,
    states: {
      deliveredAt: 'bg-green-500',
      openedAt: 'bg-green-500',
      clickedAt: 'bg-green-500',
      failedAt: 'bg-red-500',
      spammedAt: 'bg-orange-500',
      unsubscribedAt: 'bg-orange-500'
    }
  }),
  setup() {
    const { can } = useAuth()
    const title = 'Templates'
    const collection = 'templates'
    const add = 'Add'

    const fields = [
      {
        name: 'name',
        labelPosition: 'top'
      },
      {
        name: 'subject',
        labelPosition: 'top'
      },
      {
        name: 'from',
        labelPosition: 'top',
        type: 'select',
        options: [
          {
            value: 'WeDance <automated@wedance.vip>',
            label: 'WeDance'
          },
          {
            value: 'Alex from WeDance <alex@wedance.vip>',
            label: 'Alex'
          }
        ]
      },
      {
        name: 'content',
        label: 'Content',
        labelPosition: 'top',
        type: 'textarea'
      }
    ]

    return {
      fields,
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
