<template>
  <TSharePreview
    type="Post"
    :username="getProfile(post.createdBy).username"
    :title="post.title"
    :description="getExcerpt(post.description)"
    :photo="post.cover"
    :styles="post.styles"
    price="Read more on wedance.vip"
  />
</template>

<script>
import { useProfiles } from '~/use/profiles'
import { getExcerpt } from '~/utils'

export default {
  layout: 'empty',
  async asyncData({ app, params, error }) {
    const ref = await app.$fire.firestore
      .collection('posts')
      .doc(params.id)
      .get()

    if (!ref.exists) {
      error({ statusCode: 404 })
    }

    const post = ref.data()

    return {
      post
    }
  },
  setup() {
    const { getProfile } = useProfiles()

    return {
      getProfile,
      getExcerpt
    }
  }
}
</script>
