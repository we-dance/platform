e<template>
  <div class="bg-white rounded shadow p-4 pb-0">
    <div class="flex items-start justify-between">
      <div class="flex mb-1">
        <TAvatar photo size="xs" :uid="item.createdBy" class="mr-2" />
        <TAvatar name :uid="item.createdBy" />
      </div>
      <div class="text-gray-600">{{ dateDiff(item.createdAt) }} ago</div>
    </div>
    <TPreview :content="item.body" />
    <div class="text-sm flex items-start justify-end">
      <TButton @click="onShowForm">Reply</TButton>
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
import { dateDiff } from '~/utils'
import { useAuth } from '~/use/auth'

export default {
  name: 'TCardComment',
  components: {
    ChildComments: () => import('./TListComments.vue'),
  },
  props: {
    postId: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    showForm: false,
  }),
  methods: {
    onShowForm() {
      if (!this.uid) {
        this.$router.push(`/signin?target=${this.$route.fullPath}%23comment`)
        return
      }

      this.showForm = !this.showForm
    },
  },
  setup() {
    const { uid } = useAuth()

    return {
      dateDiff,
      uid,
    }
  },
}
</script>
