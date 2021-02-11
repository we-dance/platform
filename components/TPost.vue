<template>
  <div class="rounded bg-white mb-4 shadow border">
    <div class="p-4">
      <div>
        <div>
          <router-link
            :to="`/posts/${item.id}`"
            class="font-bold leading-tight"
            >{{ item.title }}</router-link
          >
          <TCardActions :id="item.id" collection="posts" :item="item" />
        </div>

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
      <TStyles class="text-xs mb-4 md:mb-0" hide-level :value="item.styles" />

      <div class="flex">
        <div class="text-gray-700 flex justify-center">
          <button
            class="text-center hover:text-red-500"
            :class="{ 'text-primary': item.response === 'up' }"
            @click="updateRsvp(item.id, 'posts', 'up')"
          >
            <TIcon name="favorite" />
          </button>
          <div class="ml-1">{{ item.upVotes }}</div>
        </div>
        <div class="text-gray-700 flex ml-4 justify-center">
          <router-link :to="`/posts/${item.id}`" class="flex">
            <TIcon name="chat" class="h-6 w-6 hover:text-primary" />
            <span>{{ item.commentsCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useRSVP from '~/use/rsvp'
import { dateDiff } from '~/utils'

export default {
  setup() {
    const { updateRsvp } = useRSVP()

    return {
      updateRsvp,
      dateDiff
    }
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
