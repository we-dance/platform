<template>
  <div>
    <textarea
      v-model="comment"
      :placeholder="`Say something nice to ${getProfile(replyTo).username}...`"
      class="border rounded p-4 w-full overflow-hidden h-auto"
    />

    <div class="flex justify-end">
      <TButton type="xs" @click="submit">Post reply</TButton>
    </div>
  </div>
</template>

<script>
import { useProfiles } from '~/use/profiles'
import { useComments } from '~/use/comments'
import { track } from '~/plugins/firebase'

export default {
  name: 'TFormComment',
  props: {
    commentId: {
      type: String,
      default: '',
    },
    postId: {
      type: String,
      default: '',
    },
    replyTo: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    comment: '',
  }),
  methods: {
    async submit() {
      if (!this.comment) {
        return
      }

      track('add_comment', {
        content_type: 'posts',
        content_id: this.postId,
      })

      await this.addComment(this.postId, this.commentId, this.comment)
      this.comment = ''

      this.$emit('submit')
    },
  },
  setup() {
    const { getProfile } = useProfiles()
    const { addComment } = useComments()

    return {
      addComment,
      getProfile,
    }
  },
}
</script>
