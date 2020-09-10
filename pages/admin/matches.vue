<template>
  <main v-if="!isAdmin" class="mt-4 mx-auto max-w-md p-4 text-sm text-center">
    Only admin can access this area.
  </main>
  <main v-else class="p-4">
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
          :title="`Recipients of ${item.id}`"
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
          <div class="flex justify-between">
            <div class="flex">
              <TAvatar :uid="item.from" photo size="xs" class="mr-2" />
              <TAvatar :uid="item.from" name class="text-sm" />
            </div>
            <div class="flex">
              <TAvatar :uid="item.to" photo size="xs" class="mr-2" />
              <TAvatar :uid="item.to" name class="text-sm" />
            </div>
          </div>

          <TPreview class="mt-4 px-4 rounded border" :content="item.message" />

          <div class="flex justify-between items-start mt-4">
            <div>
              <div class="flex text-xs">
                <div class="mb-2 text-gray-500 mr-2">
                  <span class="font-bold">Created</span> at
                  {{ getDate(item.createdAt) }} at
                  {{ getTime(item.createdAt) }}
                </div>
              </div>
            </div>
            <div>
              <div
                class="text-xs text-white font-bold px-2 py-1 rounded-full"
                :class="statusClass[item.status]"
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
import { getDate, getTime } from '~/utils'

export default {
  data: () => ({
    data: '',
    peopleId: false,
    statusClass: {
      draft: 'bg-gray-500',
      open: 'bg-blue-500',
      sent: 'bg-orange-500',
      confirmed: 'bg-green-500',
      closed: 'bg-red-900',
      error: 'bg-red-500',
      reported: 'bg-red-500'
    }
  }),
  setup() {
    const { can, isAdmin } = useAuth()
    const title = 'Matches'
    const collection = 'matches'
    const add = 'Add'

    const fields = [
      {
        name: 'status',
        type: 'select',
        defaultValue: 'draft',
        options: ['draft', 'open', 'sent', 'confirmed', 'reported', 'closed']
      },
      {
        name: 'from',
        type: 'account'
      },
      {
        name: 'to',
        type: 'account'
      },
      {
        name: 'auto',
        type: 'select',
        options: ['Yes', 'No']
      },
      {
        name: 'message',
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
      isAdmin,
      can
    }
  }
}
</script>
