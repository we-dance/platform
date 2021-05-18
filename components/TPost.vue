<template>
  <div class="border-b p-4 flex items-start">
    <div class="w-12 flex-shrink-0">
      <TAvatar photo size="md" :uid="item.createdBy" />
    </div>
    <div class="flex-grow">
      <div class="text-xs my-1 space-x-2 flex items-center">
        <router-link
          :to="`/${item.username}`"
          class="font-bold hover:underline"
          >{{ item.username }}</router-link
        >

        <router-link
          :to="`/posts/${item.id}`"
          class="text-xs text-gray-600 hover:underline text-right"
          >{{ dateDiff(item.createdAt) }} ago</router-link
        >
      </div>

      <router-link :to="`/posts/${item.id}`" class="leading-tight">{{
        item.title
      }}</router-link>
    </div>
    <TButtonFav collection="posts" :item="item" />
  </div>
</template>

<script>
import { useApp } from '~/use/app'
import { dateDiff } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { getCity } = useApp()

    return {
      dateDiff,
      getCity
    }
  }
}
</script>
