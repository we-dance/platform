<template>
  <div class="flex items-center space-x-2 border-b p-4">
    <TAvatar photo size="sm" :uid="item.createdBy" />
    <TButtonFav collection="posts" :item="item" />
    <div>
      <router-link
        :to="`/posts/${item.id}`"
        class="leading-tight hover:underline"
        >{{ item.title }}</router-link
      >
      <div class="flex space-x-2 text-xs">
        <TAvatar name :uid="item.createdBy" />
        <div>•</div>
        <div>{{ item.community || 'Global' }}</div>
        <div>•</div>
        <div>{{ dateDiff(item.createdAt) }} ago</div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateDiff } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      dateDiff,
    }
  },
}
</script>
