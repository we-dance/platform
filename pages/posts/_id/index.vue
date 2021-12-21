<template>
  <div>
    <TItemToolbar collection="posts" :item="doc" class="mb-2" />

    <TItemCard>
      <h1 class="text-3xl leading-tight font-bold">{{ doc.title }}</h1>
      <div class="flex text-sm space-x-1">
        <div>
          {{ $t('posts.by') }}
          <router-link
            class="underline text-primary"
            :to="`/${author.username}`"
            >{{ author.username }}</router-link
          >
        </div>
        <div>• {{ publishedAt }}</div>
      </div>

      <TPreview
        :content="doc.description"
        class="mt-4"
        :class="uid || $route.query.preview ? '' : 'h-64 overflow-hidden'"
      />
      <div v-if="!uid" class="p-4 text-center bg-gray-100 rounded">
        <router-link
          :to="`/signin?target=${$route.fullPath}`"
          class="underline text-blue-500 hover:no-underline"
          >{{ $t('posts.login') }}</router-link
        >
        {{ $t('posts.link.read') }}
        <router-link
          :to="`/register?target=${$route.fullPath}`"
          class="underline text-blue-500 hover:no-underline"
          >{{ $('posts.register') }}</router-link
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
        >{{ $t('posts.login') }}</router-link
      >
      {{ $t('posts.link.discuss') }}
      <router-link
        :to="`/register?target=${$route.fullPath}`"
        class="underline text-blue-500 hover:no-underline"
        >{{ $('posts.register') }}</router-link
      >.
    </div>

    <TSharePreviewPost
      type="Post"
      collection="posts"
      :username="author.username"
      :title="doc.title"
      :description="getExcerpt(doc.description)"
      :photo="doc.cover"
      :styles="doc.styles"
      align="center"
      class="md:mt-4"
    />
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getMeta, loadDoc, getDateTime } from '~/utils'

export default {
  async asyncData(ctx) {
    return await loadDoc(ctx, 'posts')
  },
  computed: {
    author() {
      return this.getProfile(this.doc.createdBy)
    },
    publishedAt() {
      return getDateTime(this.doc?.createdAt)
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
