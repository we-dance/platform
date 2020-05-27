<template>
  <div>
    <TPreview :content="item.body" />
    <div>
      <div class="text-sm flex items-center">
        <TAvatar photo :uid="item.createdBy" />

        <div class="flex w-full items-center">
          <TAvatar name :uid="item.createdBy" />
          <span class="mx-1">•</span>
          <div class="text-gray-600">
            {{ dateDiff(item.createdAt) }}
          </div>
          <span class="mx-1">•</span>
          <TButton type="link" @click="onShowForm">Reply</TButton>
        </div>
      </div>
    </div>

    <TFormComment
      v-if="showForm"
      class="mt-4"
      :post-id="postId"
      :comment-id="item.id"
      :reply-to="item.createdBy"
      @submit="showForm = false"
    />

    <ChildComments class="ml-4 mt-4" :post-id="postId" :comment-id="item.id" />
  </div>
</template>

<script>
import ChildComments from '~/components/TListComments'
import { dateDiff } from '~/utils'
import useAuth from '~/use/auth'

export default {
  name: 'TCardComment',
  components: {
    ChildComments
  },
  props: {
    postId: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showForm: false
  }),
  methods: {
    onShowForm() {
      if (!this.uid) {
        this.$router.push(`/signin?target=${this.$route.fullPath}%23comment`)
        return
      }

      this.showForm = !this.showForm
    }
  },
  setup() {
    const { uid } = useAuth()

    return {
      dateDiff,
      uid
    }
  }
}
</script>
