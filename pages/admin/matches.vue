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
      <template v-slot="{ item }">
        <div class="p-4 border rounded mb-4 bg-real-white">
          <div class="flex justify-between items-start">
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

          <div class="flex mt-4">
            <div class="mt-6 mr-4 flex flex-col justify-start items-center">
              <TAvatar :uid="item.from" photo size="md" />
              <TAvatar :uid="item.from" name class="text-sm mb-4" />
              <TAvatar :uid="item.to" photo size="md" />
              <TAvatar :uid="item.to" name class="text-sm" />
            </div>
            <TPreview class="px-4 rounded border" :content="item.message" />
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
    const { isAdmin } = useAuth()
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
      isAdmin
    }
  }
}
</script>
