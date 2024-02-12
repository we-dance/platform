<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <TLoader v-if="loading" />
    <TPost v-else-if="story.type === 'review'" :item="story" />
    <div v-else>
      <div class="p-4 border-b">
        <h1 class="text-2xl font-bold">
          {{ story.description }}
        </h1>

        <div class="text-sm flex gap-1 flex-wrap">
          <TAvatar photo name :uid="story.createdBy" />
          asking
          <span v-if="story.style"
            >for <strong class="font-bold">{{ story.style }}</strong></span
          >
          <span v-if="story.place">in <TCityLink :place="story.place"/></span>
        </div>
      </div>

      <TReviewForm
        class="border-b"
        :place="story.place"
        :dance="story.style"
        hide-place
        hide-dance
        hide-cancel
      />

      <TPost
        v-for="item in replies"
        :key="item.id"
        :item="item"
        hide-reply-for
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'

export default {
  name: 'ViewStory',
  setup(props, { root }) {
    const story = ref({})
    const replies = ref([])
    const loading = ref(true)

    onMounted(() => {
      db.collection('stories')
        .doc(root.$route.params.storyId)
        .onSnapshot((storyRef) => {
          story.value = {
            ...storyRef.data(),
            id: storyRef.id,
          }
          loading.value = false
        })

      db.collection('stories')
        .where('question', '==', root.$route.params.storyId)
        .onSnapshot((repliesRef) => {
          replies.value = repliesRef.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        })
    })

    return {
      story,
      loading,
      replies,
    }
  },
}
</script>
