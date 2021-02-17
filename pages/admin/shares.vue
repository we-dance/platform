<template>
  <TCardList collection="shares" title="Shares" :fields="fields">
    <template v-slot:empty>
      <div class="text-center mt-4">
        No scheduled posts.
      </div>
    </template>
    <template v-slot:default="{ item }">
      <div class="rounded bg-white mb-4 shadow border overflow-hidden">
        <div class="flex justify-between p-4">
          <div>{{ item.city }}</div>
          <div>{{ item.state }}</div>
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

    return {
      fields
    }
  }
}
</script>
