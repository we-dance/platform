<template>
  <div class="md:grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <div>
        <div class="bg-real-white p-4 border rounded shadow">
          <div v-if="can('edit', 'posts', item)" class="mb-2 flex items-start">
            <TButton
              icon="edit"
              :to="`/posts/${item.id}/edit`"
              class="hover:text-blue-500"
              label="Edit"
            />
          </div>

          <TTagsPreview :value="item.tags" />

          <h1 class="font-bold text-2xl leading-tight">
            {{ item.title }}
          </h1>

          <TPreview :content="item.description" />

          <div class="border-t mt-4 p-4 -mx-4 -mb-4 bg-gray-100">
            <div class="flex justify-between items-center">
              <div class="flex">
                <div class="text-gray-700 flex justify-center">
                  <button
                    class="text-center hover:text-red-500"
                    :class="{ 'text-primary': richItem.response === 'up' }"
                    @click="updateRsvp(item.id, 'posts', 'up')"
                  >
                    <TIcon name="favorite" />
                  </button>
                  <div class="ml-1">
                    {{ richItem.upVotes }}
                  </div>
                </div>
              </div>
              <div>
                <TButton :href="tweetUrl">Share</TButton>
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
      <TFormComment :post-id="item.id" :reply-to="item.createdBy" />

      <TListComments :post-id="item.id">
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
      exists: true,
      loading: false,
      item: doc
    }
  },
  data: () => ({
    comment: '',
    item: {},
    loading: true,
    exists: true
  }),
  computed: {
    publishedAt() {
      return getDateTime(this.item.createdAt)
    },
    author() {
      return this.getProfile(this.item.createdBy)
    },
    richItem() {
      return this.map(this.item)
    },
    tweetUrl() {
      const app = process.env.app

      const author = this.author.username
      const url = app.url + this.$route.fullPath

      const text = encodeURI(`"${this.item.title}" by ${author}`)

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
      title: this.item.title,
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: getExcerpt(this.item.description)
        },
        {
          vmid: 'keywords',
          name: 'keywords',
          content: this.item.keywords
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: this.item.title
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: getExcerpt(this.item.description)
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
