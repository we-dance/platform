<template>
  <div class="border-b p-4 flex items-start">
    <div class="w-12 flex-shrink-0">
      <TAvatar photo size="md" :uid="item.createdBy" />
    </div>
    <div class="flex-grow">
      <div>
        <div class="text-xs my-1 space-x-2 flex items-center">
          <TAvatar name :uid="item.createdBy" class="font-bold" />

          <router-link
            :to="`/posts/${item.id}`"
            class="text-xs text-gray-600 hover:underline text-right"
            >{{ dateDiff(item.createdAt) }} ago</router-link
          >
        </div>

        <router-link
          :to="`/posts/${item.id}`"
          class="font-bold leading-tight"
          >{{ item.title }}</router-link
        >

        <TPreview class="mt-2" :content="item.description" :excerpt="true" />
      </div>
      <div class="md:flex items-center justify-between">
        <div class="flex space-x-2 items-center">
          <span class="text-xs mr-2">{{
            item.place ? getCity(item.place) : 'Global'
          }}</span>
          <TStyles
            class="text-xs mb-4 md:mb-0"
            hide-level
            :value="item.styles"
            :max="4"
          />
        </div>

        <div class="flex items-center space-x-2">
          <TButtonFav collection="posts" :item="item" />
        </div>
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
