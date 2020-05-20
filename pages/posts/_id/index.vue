<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Post not found
  </div>
  <div v-else class="p-4 mx-auto container">
    <div class="md:grid grid-cols-12 gap-6">
      <div class="col-span-8">
        <div>
          <TTagsPreview :value="item.tags" />

          <h1 class="font-bold text-2xl mb-2 leading-tight">
            {{ item.title }}
          </h1>

          <TSignature small :item="item" />

          <TPreview class="mt-2" :content="item.description" />

          <Microlink v-if="item.link" class="mt-2" :url="item.link" />

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
        <div class="mb-4 rounded border shadow p-4">
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

      <div class="col-span-8">
        <TCardList
          :collection="collection"
          title="Discussion"
          add="Add to the discussion"
          :fields="fields"
          :map="map"
          :filters="filters"
        >
          <template v-slot:auth>
            <div class="text-center mt-4">
              <div class="mb-4">
                Sign in to write a comment.
              </div>
              <TButton to="/signin">Sign in</TButton>
            </div>
          </template>
          <template v-slot:empty>
            <div class="text-center mt-4">
              There are no comments yet.
            </div>
          </template>
          <template v-slot:default="{ item }">
            <div class="rounded bg-white mb-4 shadow border">
              <div class="p-4">
                <TSignature small :item="item" />
                <TPreview class="ml-6 mt-2" :content="item.body" />
              </div>
              <div class="px-4 pb-4 flex items-center">
                <div class="text-green-500 flex">
                  <button
                    class="text-center hover:text-green-500"
                    :class="{ 'text-green-700': item.response === 'up' }"
                    @click="updateRsvp(item.id, collection, 'up')"
                  >
                    <TIcon name="up" class="h-6 w-6" />
                  </button>
                  <div>
                    {{ item.upVotes }}
                  </div>
                </div>
                <div class="text-red-500 flex ml-2">
                  <button
                    class="text-center hover:text-primary"
                    :class="{ 'text-red-700': item.response === 'down' }"
                    @click="updateRsvp(item.id, collection, 'down')"
                  >
                    <TIcon name="down" class="h-6 w-6 hover:text-primary" />
                  </button>
                  <div>
                    {{ item.downVotes }}
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
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TTagsPreview from '~/components/TTagsPreview'
import TButton from '~/components/TButton'
import TLoader from '~/components/TLoader'
import TIcon from '~/components/TIcon'
import TSignature from '~/components/TSignature'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useComments from '~/use/comments'
import useAccounts from '~/use/accounts'
import { getDateTime } from '~/utils'

export default {
  name: 'PostView',
  layout: 'minimal',
  components: {
    TLoader,
    TCardList,
    TPreview,
    TButton,
    TIcon,
    TSignature,
    Microlink,
    TTagsPreview
  },
  computed: {
    tweetUrl() {
      const app = process.env.app

      const author = this.getAccount(this.item.createdBy).name
      const url = app.url + this.$route.fullPath

      const text = encodeURI(`"${this.item.title}" by ${author}`)

      return `https://twitter.com/intent/tweet?text=${text} %23WeDance ${url}`
    }
  },
  head() {
    return {
      title: this.item?.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.item?.description
        }
      ]
    }
  },
  setup() {
    const { can } = useAuth()
    const { params } = useRouter()
    const { getAccount } = useAccounts()

    const collection = 'comments'

    const fields = [
      {
        name: 'body',
        label: 'Comment',
        type: 'markdown'
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
    const { getCommentsCount } = useComments()

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

      return {
        ...item,
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
      getDateTime
    }
  }
}
</script>
