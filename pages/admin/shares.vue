<template>
  <TCardList
    collection="shares"
    title="Shares"
    :fields="fields"
    :filters="states"
  >
    <template v-slot:empty>
      <div class="text-center mt-4">
        No scheduled posts.
      </div>
    </template>
    <template v-slot:default="{ item }">
      <div class="rounded bg-white mb-4 shadow border overflow-hidden">
        <div class="p-4 space-y-2">
          <div class="flex justify-between">
            <div>{{ item.city || 'Everywhere' }}</div>
            <TInputSelect
              :value="item.state"
              :options="states"
              @input="(val) => changeState(item.id, val)"
            />
          </div>
          <div class="flex justify-between">
            <TAvatar :uid="item.createdBy" name />
            <div>{{ getDateTime(item.createdAt) }}</div>
          </div>
        </div>
        <img :src="item.image" />
      </div>
    </template>
  </TCardList>
</template>

<script>
import { getDateTime } from '~/utils'

export default {
  name: 'PageAdminShares',
  setup() {
    const fields = [
      {
        name: 'state'
      },
      {
        name: 'collection'
      },
      {
        name: 'contentId'
      },
      {
        name: 'image'
      },
      {
        name: 'url'
      },
      {
        name: 'city'
      },
      {
        name: 'visibility'
      },
      {
        name: 'scheduledAt'
      },
      {
        name: 'publishedAt'
      },
      {
        name: 'publishedBy'
      }
    ]

    const states = [
      {
        label: 'New',
        name: 'new',
        value: 'new',
        filter: (item) => item.state === 'new',
        sort: 'createdAt',
        default: true
      },
      {
        label: 'Published',
        name: 'published',
        value: 'published',
        filter: (item) => item.state === 'published',
        sort: 'createdAt'
      },
      {
        label: 'Cancelled',
        name: 'cancelled',
        value: 'cancelled',
        filter: (item) => item.state === 'cancelled',
        sort: 'createdAt'
      }
    ]

    return {
      fields,
      getDateTime,
      states
    }
  },
  methods: {
    async changeState(id, state) {
      await this.$fire.firestore
        .collection('shares')
        .doc(id)
        .update({
          state
        })
    }
  }
}
</script>
