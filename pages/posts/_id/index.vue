<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Post not found
  </div>
  <div v-else>
    <div class="md:grid grid-cols-12 gap-6">
      <div class="col-span-8 bg-white rounded p-4">
        <div>
          <TTagsPreview :value="item.tags" />

          <h1 class="font-bold text-2xl mb-2 leading-tight">
            {{ item.title }}
          </h1>

          <TSignature small :item="item" />

          <TPreview class="mt-2" :content="item.description" />

          <Microlink v-if="item.link" class="mt-2 z-0" :url="item.link" />

          <div v-if="can('edit', 'posts', item)" class="my-2 flex items-start">
            <TButton
              icon="edit"
              :to="`/posts/${item.id}/edit`"
              class="hover:text-blue-500"
              label="Edit"
            />
          </div>

          <div class="flex justify-between items-center border p-4 my-4">
            <div class="flex">
              <div class="text-green-500 flex justify-center">
                <button
                  class="text-center hover:text-green-500"
                  :class="{ 'text-green-700': item.response === 'up' }"
                  @click="updateRsvp(item.id, 'posts', 'up')"
                >
                  <TIcon name="up" class="h-6 w-6" />
                </button>
                <div>
                  {{ item.upVotes }}
                </div>
              </div>
              <div class="text-red-500 flex ml-2 justify-center">
                <button
                  class="text-center hover:text-primary"
                  :class="{ 'text-red-700': item.response === 'down' }"
                  @click="updateRsvp(item.id, 'posts', 'down')"
                >
                  <TIcon name="down" class="h-6 w-6 hover:text-primary" />
                </button>
                <div>
                  {{ item.downVotes }}
                </div>
              </div>
            </div>
            <div>
              <TButton :href="tweetUrl">Share</TButton>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-4 col-start-9 row-start-1">
        <div class="mt-4 md:mt-0 mb-4 rounded border shadow p-4 bg-white">
          <router-link
            :to="`/u/${getAccount(item.createdBy).username}`"
            class="text-sm flex items-center"
          >
            <img
              class="rounded-full mr-2 w-10 h-10"
              :src="getAccount(item.createdBy).photo"
            />
            <div>
              <div class="font-bold">
                {{ getAccount(item.createdBy).name }}
              </div>
              <div class="text-gray-600">
                @{{ getAccount(item.createdBy).username }}
              </div>
            </div>
          </router-link>
          <div class="text-sm mt-2">
            <div>{{ getAccount(item.createdBy).summary }}</div>
            <dl class="mt-2">
              <dt class="font-bold mr-1">Location:</dt>
              <dd>{{ getAccount(item.createdBy).location }}</dd>
            </dl>
            <dl class="mt-2">
              <dt class="font-bold mr-1">Joined:</dt>
              <dd>{{ getDateTime(getAccount(item.createdBy).createdAt) }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div id="comment" class="col-span-8" @click="checkAuth">
        <div>
          <textarea
            v-model="comment"
            :placeholder="
              `Say something nice to ${getAccount(item.createdBy).username}...`
            "
            class="border rounded p-4 w-full overflow-hidden h-auto"
          />

          <div class="flex justify-end">
            <TButton
              @click="
                addComment(item.id, comment)
                comment = ''
              "
            >
              Post comment
            </TButton>
          </div>
        </div>

        <TCardList
          :collection="collection"
          :fields="fields"
          :map="map"
          :filters="filters"
        >
          <template v-slot:empty>
            <div class="text-center my-8">
              There are no comments yet.
            </div>
          </template>
          <template v-slot:default="{ item }">
            <div class="mb-4">
              <div>
                <TPreview :content="item.body" />
                <div>
                  <div class="text-sm flex items-center">
                    <img
                      class="rounded-full mr-2 w-4 h-4"
                      :src="getAccount(item.createdBy).photo"
                    />
                    <div class="flex w-full items-center">
                      <router-link
                        class="hover:underline"
                        :to="`/u/${getAccount(item.createdBy).username}`"
                      >
                        {{ getAccount(item.createdBy).username }}
                      </router-link>
                      <span class="mx-1">•</span>
                      <div class="text-gray-600">
                        {{ dateDiff(item.createdAt) }}
                      </div>
                      <span class="mx-1">•</span>
                      <TButton type="link">Reply</TButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </TCardList>
      </div>
    </div>
  </div>
</template>

<script>
import { Microlink } from '@microlink/vue'
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useComments from '~/use/comments'
import useAccounts from '~/use/accounts'
import { getDateTime, getExcerpt, dateDiff } from '~/utils'

export default {
  layout: 'minimal',
  components: {
    Microlink
  },
  data: () => ({
    comment: ''
  }),
  computed: {
    tweetUrl() {
      const app = process.env.app

      const author = this.getAccount(this.item.createdBy).name
      const url = app.url + this.$route.fullPath

      const text = encodeURI(`"${this.item.title}" by ${author}`)

      return `https://twitter.com/intent/tweet?text=${text} %23WeDance ${url}`
    }
  },
  watch: {
    item() {
      this.$nextTick(() => {
        this.load()
      })
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
    if (!this.item) {
      return {}
    }

    const item = this.item

    return {
      title: item.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: item.excerpt
        },
        {
          name: 'keywords',
          content: item.keywords,
          hid: 'keywords'
        },
        {
          property: 'og:title',
          content: item.title,
          hid: 'og:title'
        },
        {
          property: 'og:description',
          content: item.excerpt,
          hid: 'og:description'
        }
      ]
    }
  },
  setup() {
    const { uid, can } = useAuth()
    const { params } = useRouter()
    const { getAccount } = useAccounts()

    const collection = 'comments'

    const fields = [
      {
        name: 'body',
        label: 'Comment',
        type: 'markdown',
        hideLabel: true
      },
      {
        name: 'postId',
        default: params.id,
        type: 'hidden'
      }
    ]

    const filters = [
      {
        name: 'all',
        default: true,
        filter: (item) => item.postId === params.id,
        sort: 'createdAt'
      }
    ]

    const { doc, load, exists, loading } = useDoc('posts')

    if (params.id) {
      load(params.id)
    }

    const { getCount, getRsvpResponse, updateRsvp } = useRSVP()
    const { getCommentsCount, addComment } = useComments()

    const map = (item) => {
      if (!item) {
        return {}
      }

      const upVotes = getCount(item.id, 'up')
      const downVotes = getCount(item.id, 'down')
      const votes = upVotes - downVotes
      const response = getRsvpResponse(item.id)
      const multi = !response ? 3 : response === 'up' ? 2 : 1
      const order = multi * 100 + votes
      const commentsCount = getCommentsCount(item.id)
      const excerpt = getExcerpt(item.description)

      let tags = item.tags || {}

      tags = {
        ...tags,
        WeDance: true,
        Dance: true
      }

      const keywords = Object.keys(tags).join(', ')

      return {
        ...item,
        excerpt,
        keywords,
        commentsCount,
        upVotes,
        downVotes,
        votes,
        response,
        order
      }
    }

    const item = computed(() => map(doc.value))

    return {
      exists,
      uid,
      loading,
      filters,
      item,
      collection,
      fields,
      map,
      getCount,
      getRsvpResponse,
      updateRsvp,
      getCommentsCount,
      can,
      getAccount,
      getDateTime,
      dateDiff,
      addComment
    }
  }
}
</script>
