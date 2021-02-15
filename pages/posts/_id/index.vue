<template>
  <div class="md:grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div>
        <div v-if="can('edit', 'posts', post)" class="mb-2 flex posts-start">
          <TButton
            icon="edit"
            :to="`/posts/${postId}/edit`"
            class="hover:text-blue-500"
            label="Edit"
          />
        </div>

        <div class="md:p-4 md:border md:rounded md:shadow overflow-hidden">
          <template v-if="false">
            <div class="-mt-4 -mx-4">
              <img
                v-if="post.cover"
                :src="post.cover"
                :alt="post.title"
                class="w-full"
              />
            </div>

            <h1 class="font-bold text-2xl leading-tight mt-4">
              {{ post.title }}
            </h1>

            <TStyles class="text-xs mt-4" hide-level :value="post.styles" />
          </template>

          <TSharePreviewPost
            type="News"
            :username="author.username"
            :title="post.title"
            :description="fullPost.excerpt"
            :photo="post.cover || author.photo"
            :styles="post.styles"
            align="center"
            class="md:-mt-4 md:-mx-4"
          />

          <TPreview :content="post.description" class="mt-4" />

          <div class="border-t mt-4 p-4 md:-mx-4 md:-mb-4 bg-gray-100">
            <div class="flex justify-between posts-center">
              <div class="flex">
                <div class="text-gray-700 flex items-center justify-center">
                  <button
                    class="text-center hover:text-red-500"
                    :class="{ 'text-primary': fullPost.response === 'up' }"
                    @click="updateRsvp(postId, 'posts', 'up')"
                  >
                    <TIcon name="favorite" />
                  </button>
                  <div class="ml-1">
                    {{ fullPost.upVotes }}
                  </div>
                </div>
              </div>
              <div>
                <TButtonShare
                  :id="post.id"
                  collection="posts"
                  :file="post.socialCover"
                  :file-name="post.title"
                  :url="`https://wedance.vip/posts/${postId}`"
                  :text="post.title"
                  type="base"
                  label="Share"
                />
              </div>
            </div>

            <div class="mt-4">
              <TProfileCard3
                :label="`Published on ${publishedAt} by`"
                :profile="author"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="comment" class="col-span-12 mt-8" @click="checkAuth">
      <TFormComment :post-id="postId" :reply-to="post.createdBy" />

      <TListComments :post-id="postId">
        <template v-slot:empty>
          <div class="text-center my-8">
            There are no comments yet.
          </div>
        </template>
      </TListComments>
    </div>
  </div>
</template>

<script>
import useRSVP from '~/use/rsvp'
import useProfiles from '~/use/profiles'
import useAuth from '~/use/auth'
import useReactions from '~/use/reactions'
import { getExcerpt, getDateTime } from '~/utils'

export default {
  async asyncData({ app, params, error }) {
    const postRef = app.$fire.firestore.collection('posts').doc(params.id)

    const snapshot = await postRef.get()
    const doc = snapshot.data()

    if (!doc) {
      error({ statusCode: 404 })
    }

    return {
      postId: params.id,
      exists: true,
      loading: false,
      post: doc
    }
  },
  data: () => ({
    postId: '',
    comment: '',
    post: {},
    loading: true,
    exists: true
  }),
  computed: {
    publishedAt() {
      return getDateTime(this.post.createdAt)
    },
    author() {
      return this.getProfile(this.post.createdBy)
    },
    fullPost() {
      return this.map(this.post)
    },
    tweetUrl() {
      const app = process.env.app

      const author = this.author.username
      const url = app.url + this.$route.fullPath

      const text = encodeURI(`"${this.post.title}" by ${author}`)

      return `https://twitter.com/intent/tweet?text=${text} %23WeDance ${url}`
    }
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
    checkAuth() {
      if (!this.uid) {
        this.$router.push(`/signin?target=${this.$route.fullPath}%23comment`)
      }
    }
  },
  head() {
    return {
      title: this.post.title,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: getExcerpt(this.post.description)
        },
        {
          vmid: 'keywords',
          name: 'keywords',
          content: this.post.keywords
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.post.title
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: getExcerpt(this.post.description)
        }
      ]
    }
  },
  setup() {
    const { getProfile } = useProfiles()
    const { uid, can } = useAuth()
    const { updateRsvp } = useRSVP()
    const { map } = useReactions()

    return {
      getProfile,
      uid,
      can,
      updateRsvp,
      map
    }
  }
}
</script>
