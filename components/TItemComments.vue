<template>
  <div id="comment" class="mt-8 text-xs">
    <TListComments class="mt-4" :post-id="postId" />
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
  },
  methods: {
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
