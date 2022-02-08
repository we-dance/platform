<template>
  <TLoader v-if="!item" />
  <div v-else>
    <button
      v-if="!showComments"
      class="p-2 text-blue-700 cursor-pointer underline hover:no-underline text-xs text-center mb-2 block w-full"
      @click="showComments = true"
    >
      {{ item.commentsCount || 0 }} comments
    </button>
    <div v-if="showComments">
      <textarea
        v-model="newReply"
        rows="1"
        placeholder="Add to the discussion"
        class="w-full border p-2 text-xs text-gray-900"
        @keyup.enter="sendReply"
      ></textarea>
    </div>
    <TItemComments v-if="showComments" :post-id="item.id" />
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { dateDiff } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    autoload: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { username } = useAuth()
    const newReply = ref('')
    const showComments = ref(props.autoload)
    const { softUpdate } = useDoc('posts')
    const { create } = useDoc('comments')

    const sendReply = async () => {
      const body = newReply.value

      if (!body) {
        return
      }

      const watchCount = props.item.watch?.count || 0
      const isWatching = !!props.item.watch?.list[username.value]

      newReply.value = ''

      const commentDocRef = await create({
        postId: props.item.id,
        commentId: '',
        body,
      })

      const commentsLast = await (await commentDocRef.get()).data()

      softUpdate(props.item.id, {
        commentsCount: props.item.commentsCount + 1,
        commentsLast,
        [`watch.count`]: isWatching ? watchCount : watchCount + 1,
        [`watch.list.${username.value}`]: true,
      })
    }

    return { newReply, sendReply, dateDiff, showComments }
  },
}
</script>
