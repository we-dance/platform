<template>
  <div class="border-b p-4 flex items-start">
    <div class="w-12 flex-shrink-0">
      <TAvatar photo size="md" :uid="item.createdBy" />
    </div>
    <div class="flex-grow">
      <router-link
        :to="`/posts/${item.id}`"
        class="block text-sm leading-tight"
        >{{ item.title }}</router-link
      >

      <div class="text-xs space-x-1 text-gray-900 flex">
        <router-link :to="`/${item.username}`" class="hover:underline">{{
          item.username
        }}</router-link>
        <span>•</span>
        <div>{{ dateDiff(item.createdAt) }} ago</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApp } from '~/use/app'
import { dateDiff } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { getCity } = useApp()

    return {
      dateDiff,
      getCity,
    }
  },
}
</script>
