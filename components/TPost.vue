<template>
  <div class="rounded bg-white mb-4 shadow border">
    <div class="p-4">
      <div>
        <div class="flex justify-between">
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

      <div class="flex items-center space-x-2">
        <TButton
          :to="`/posts/${item.id}`"
          icon="chat"
          type="icon"
          :label="item.commentsCount"
        />
        <TButtonLike
          :value="item.response === 'up'"
          :count="item.upVotes"
          @change="updateRsvp(item.id, 'posts', 'up')"
        />
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
