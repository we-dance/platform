<template>
  <div class="w-full">
    <TAvatar photo name :uid="item.createdBy">
      <span>•</span>
      <div>{{ dateDiff(item.createdAt) }}</div>
    </TAvatar>
    <div class="mt-1">{{ item.body }}</div>
    <div class="text-sm flex items-start mt-1">
      <TButton title="Reply" label="Reply" type="xs" @click="onShowForm" />
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
