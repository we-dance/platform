<template>
  <div>
    Comments are temporarily not working.
  </div>
</template>

<script>
import useProfiles from '~/use/profiles'
import useComments from '~/use/comments'

export default {
  name: 'TFormComment',
  props: {
    commentId: {
      type: String,
      default: ''
    },
    postId: {
      type: String,
      default: ''
    },
    replyTo: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    comment: ''
  }),
  methods: {
    submit() {
      if (!this.comment) {
        return
      }

      this.addComment(this.postId, this.commentId, this.comment)
      this.comment = ''

      this.$emit('submit')
    }
  },
  setup() {
    const { getProfile } = useProfiles()
    const { addComment } = useComments()

    return {
      addComment,
      getProfile
    }
  }
}
</script>
