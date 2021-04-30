<template>
  <div class="rounded bg-white mb-4 shadow border">
    <div class="p-4">
      <div>
        <router-link
          :to="`/posts/${item.id}`"
          class="font-bold leading-tight"
          >{{ item.title }}</router-link
        >

        <div class="text-xs my-1 flex items-center">
          <TAvatar class="mr-2" photo size="sm" :uid="item.createdBy" />
          <TAvatar class="mr-2" name :uid="item.createdBy" />
          <span class="text-xs text-primary mr-2">{{
            item.community || 'Global'
          }}</span>
          <router-link
            :to="`/posts/${item.id}`"
            class="text-xs text-gray-600 hover:underline text-right"
            >{{ dateDiff(item.createdAt) }} ago</router-link
          >
        </div>

        <TPreview class="mt-2" :content="item.description" :excerpt="true" />
      </div>
    </div>
    <div class="px-4 pb-4 md:flex items-center justify-between">
      <TStyles
        class="text-xs mb-4 md:mb-0"
        hide-level
        :value="item.styles"
        :max="4"
      />

      <div class="flex items-center space-x-2">
        <TButtonFav collection="posts" :item="item" />
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
      default: () => ({})
    }
  },
  setup() {
    return {
      dateDiff
    }
  }
}
</script>
