<template>
  <div>
    <span>{{ label }}</span>
    <router-link
      :to="`/stories/${story.id}`"
      class="font-bold underline hover:no-underline"
      >{{ story.description }}</router-link
    >
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'

export default {
  name: 'WQuestion',
  props: {
    storyId: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const story = ref({})

    onMounted(async () => {
      const storyRef = await db
        .collection('stories')
        .doc(props.storyId)
        .get()

      story.value = {
        ...storyRef.data(),
        id: storyRef.id,
      }
    })

    return {
      story,
    }
  },
}
</script>
