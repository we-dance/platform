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
      <TPreview
        :content="doc.description"
        class="mt-4"
        :class="uid || $route.query.preview ? '' : 'h-64 overflow-hidden'"
      />
      <div v-if="!uid" class="p-4 text-center bg-gray-100 rounded">
        <router-link
          :to="`/signin?target=${$route.fullPath}`"
          class="underline text-blue-500 hover:no-underline"
          >Login</router-link
        >
        to read full post. Not a member yet?
        <router-link
          :to="`/register?target=${$route.fullPath}`"
          class="underline text-blue-500 hover:no-underline"
          >Register</router-link
        >.
      </div>
      <TItemFooter collection="posts" :item="doc" :title="doc.title" />
      <TItemCreator :item="doc" />
    </TItemCard>

    <TItemComments v-if="uid" :reply-to="doc.createdBy" :post-id="doc.id" />
    <div v-else class="mt-4 p-4 text-center bg-gray-100 rounded">
      <router-link
        :to="`/signin?target=${$route.fullPath}`"
        class="underline text-blue-500 hover:no-underline"
        >Login</router-link
      >
      to see discussion. Not a member yet?
      <router-link
        :to="`/register?target=${$route.fullPath}`"
        class="underline text-blue-500 hover:no-underline"
        >Register</router-link
      >.
    </div>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getMeta, loadDoc } from '~/utils'

export default {
  async asyncData(ctx) {
    return await loadDoc(ctx, 'posts')
  },
  computed: {
    author() {
      return this.getProfile(this.doc.createdBy)
    },
  },
  head() {
    return getMeta('posts', this.doc)
  },
  setup() {
    const { uid } = useAuth()
    const { getProfile } = useProfiles()

    return {
      uid,
      getProfile,
      getExcerpt,
    }
  },
}
</script>
