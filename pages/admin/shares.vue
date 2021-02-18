<template>
  <TCardList
    collection="shares"
    title="Shares"
    :fields="fields"
    :filters="filters"
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
            <div>{{ item.city }}</div>
            <div>{{ item.state }}</div>
          </div>
          <div class="flex justify-between">
            <div>{{ item.createdAt }}</div>
            <div>{{ item.createdBy }}</div>
          </div>
        </div>
        <img :src="item.image" />
      </div>
    </template>
  </TCardList>
</template>

<script>
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

    const filters = [
      {
        default: true,
        name: 'default',
        sort: 'createdAt'
      }
    ]

    return {
      fields,
      filters
    }
  }
}
</script>
