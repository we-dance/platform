<template>
  <div class="border-b p-4 flex items-start">
    <div class="w-12 flex-shrink-0">
      <TAvatar photo size="md" :uid="item.createdBy" />
    </div>
    <div class="flex-grow">
      <router-link
        :to="`/posts/${item.id}`"
        class="block text-sm leading-tight"
      >
        <h4 class="font-bold">{{ item.title }}</h4>
        <TPreview excerpt :content="item.description" />
      </router-link>

      <div class="text-xs space-x-1 text-gray-900 flex">
        <router-link :to="`/${item.username}`" class="hover:underline">{{
          item.username
        }}</router-link>
        <span>•</span>
        <div>{{ dateDiff(item.createdAt) }} ago</div>
        <template v-if="item.region">
          <span>•</span>
          <div>{{ item.region.name }}</div>
        </template>
      </div>

      <div class="border-t mt-4">
        <div
          v-if="item.commentsCount > 1"
          class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2"
        >
          Show all {{ item.commentsCount - 1 }} comments
        </div>
        <div
          v-if="item.commentsCount < 0"
          class="text-xs text-gray-900 p-2 text-center mb-2"
        >
          There are no replies yet.
        </div>
        <div
          v-if="item.commentsCount > 0"
          class="flex text-xs space-x-1 text-gray-900 p-2"
        >
          <div>
            <TAvatar photo name :uid="item.commentsLast.createdBy">
              <span>•</span>
              <div>{{ dateDiff(item.commentsLast.createdAt) }} ago</div>
            </TAvatar>
            <div class="mt-1">{{ item.commentsLast.body }}</div>
          </div>
        </div>
        <div>
          <textarea
            v-model="newReply"
            rows="1"
            :placeholder="`Reply to ${item.username}`"
            class="w-full border p-2 text-xs text-gray-900"
            @keyup.enter="sendReply"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue-demi'
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
    const newReply = ref('')
    const sendReply = () => {}

    return {
      dateDiff,
      getCity,
      newReply,
      sendReply,
    }
  },
}
</script>
