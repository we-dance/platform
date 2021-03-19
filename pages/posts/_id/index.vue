<template>
  <div>
    <TItemToolbar collection="posts" :item="doc" class="mb-2" />

    <TItemCard>
      <TSharePreviewPost
        type="Post"
        collection="posts"
        :username="author.username"
        :title="doc.title"
        :description="getExcerpt(doc.description)"
        :photo="doc.cover"
        :styles="doc.styles"
        align="center"
        class="md:-mt-4 md:-mx-4"
      />
      <TPreview :content="doc.description" class="mt-4" />
      <TItemFooter collection="posts" :item="doc" :title="doc.title" />
      <TItemCreator :item="doc" />
    </TItemCard>

    <TItemComments :reply-to="doc.createdBy" :post-id="doc.id" />
  </div>
</template>

<script>
import useProfiles from '~/use/profiles'
import { getExcerpt, getMeta, loadDoc } from '~/utils'

export default {
  async asyncData(ctx) {
    return await loadDoc(ctx, 'posts')
  },
  computed: {
    author() {
      return this.getProfile(this.doc.createdBy)
    }
  },
  head() {
    return getMeta('posts', this.doc)
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
