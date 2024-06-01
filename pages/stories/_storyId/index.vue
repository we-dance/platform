<template>
  <div>
    <TLoader v-if="loading" />
    <TPost
      v-else-if="story.type !== 'ask-for-recommendations'"
      :item="story"
      expanded
    />
    <div v-else>
      <div class="p-4 border-b">
        <div class="text-xs text-gray-700">{{ dateDiff(story.createdAt) }}</div>
        <h1 class="text-2xl font-bold">
          {{ story.description }}
        </h1>

        <div class="text-sm flex gap-1 flex-wrap">
          <TAvatar photo name :uid="story.createdBy" />
          asking
          <span v-if="story.style"
            >for <TDanceLink :dance="story.style" class="fond-bold"
          /></span>
          <span v-if="story.place">in <TCityLink :place="story.place"/></span>
        </div>
      </div>

      <TReviewForm
        class="border-b"
        :place="story.place"
        :dance="story.style"
        :question="story.id"
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
import { dateDiff, getDateObect } from '~/utils'

export default {
  name: 'ViewStory',
  layout: 'full',
  head() {
    if (this.story.type !== 'ask-for-recommendations') {
      return {
        title: this.story.description,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.story.description,
          },
        ],
      }
    }

    const answers = this.replies.map((reply) => ({
      '@type': 'Answer',
      text: reply.description,
      datePublished: getDateObect(reply.createdAt).toISOString(),
      upvoteCount: 1337,
    }))

    return {
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'QAPage',
            mainEntity: {
              '@type': 'Question',
              name: this.story.description,
              text: this.story.description,
              dateCreated: getDateObect(this.story.createdAt).toISOString(),
              answerCount: answers.length,
              acceptedAnswer: answers.length > 0 ? answers[0] : null,
              suggestedAnswer: answers.length > 1 ? answers.slice(1) : null,
            },
          },
        },
      ],
    }
  },
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
      dateDiff,
    }
  },
}
</script>
