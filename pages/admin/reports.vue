<template>
  <div v-if="!isAdmin" class="mt-4 mx-auto max-w-md p-4 text-sm text-center">
    Only admin can access this area.
  </div>
  <div v-else>
    <TCardList
      :collection="collection"
      title="Reports"
      add="Add a report"
      :fields="fields"
      :filters="filters"
    >
      <template v-slot:default="{ item }">
        <div class="mb-4 bg-white max-w-sm">
          <div class="bg-white p-4 max-w-sm">
            <div>Reported by {{ getAccount(item.createdBy).name }}</div>
            <div class="text-xs">
              {{ getDateTime(item.createdAt) }}
            </div>
            <div>State: {{ item.state }}</div>
            <div>Category: {{ item.category }}</div>
            <div>Reason: {{ item.reason }}</div>
            <div>Collection: {{ item.collection }}</div>
            <div>Document: {{ item.documentId }}</div>
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import { useAuth } from '~/use/auth'
import { useAccounts } from '~/use/accounts'

export default {
  middleware: ['auth'],
  setup() {
    const collection = 'reports'

    const fields = [
      {
        name: 'state',
        label: 'State',
        component: 'TInputSelect',
        options: ['open', 'accepted', 'declined'],
      },
      {
        name: 'category',
        label: 'Category',
        component: 'TInputSelect',
        options: ['spam', 'claim'],
      },
      {
        name: 'reason',
        label: 'Reason',
      },
      {
        name: 'collection',
        label: 'Collection',
      },
      {
        name: 'documentId',
        label: 'Document',
      },
    ]

    const { uid, isAdmin } = useAuth()
    const { getAccount } = useAccounts()

    const filters = [
      {
        name: 'all',
        label: 'All',
        default: true,
      },
    ]

    return {
      collection,
      fields,
      getDateTime,
      filters,
      uid,
      isAdmin,
      getAccount,
    }
  },
}
</script>
