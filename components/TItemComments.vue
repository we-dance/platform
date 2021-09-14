<template>
  <div id="comment" class="col-span-12 mt-8" @click="checkAuth">
    <TFormComment :post-id="postId" :reply-to="replyTo" />

    <TListComments class="mt-4" :post-id="postId">
      <template v-slot:empty>
        <div class="text-center my-8">There are no comments yet.</div>
      </template>
    </TListComments>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  props: {
    postId: {
      type: String,
      default: '',
    },
    replyTo: {
      type: String,
      default: '',
    },
  },
  methods: {
    checkAuth() {
      if (!this.uid) {
        this.$router.push(`/signin?target=${this.$route.fullPath}%23comment`)
      }
    },

    load() {
      const hash = this.$route.hash.replace('#', '')

      if (hash) {
        const el = document.getElementById(hash)

        if (el) {
          el.scrollIntoView()
        }
      }
    },
  },
  setup() {
    const { uid } = useAuth()

    return {
      uid,
    }
  },
}
</script>
