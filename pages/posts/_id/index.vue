<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Post not found
  </div>
  <div v-else class="p-4">
    <div
      v-if="can('edit', 'posts', item)"
      class="flex justify-end mb-2 hover:text-blue-500"
    >
      <TButton icon="edit" :to="`/posts/${item.id}/edit`" />
    </div>

    <div class="card-item border">
      <div class="p-4">
        <h1 class="font-bold text-2xl mt-2 leading-tight">
          {{ item.title }}
        </h1>

        <TPreview class="mt-2" :content="item.description" />

        <Microlink v-if="item.link" class="mt-2" :url="item.link" />
      </div>
      <div
        class="bg-gray-200 border-t px-4 py-4 flex items-center justify-between"
      >
        <div class="md:flex">
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
          <div class="text-red-500 flex md:ml-2 justify-center">
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
          <div class="text-gray-700 flex md:ml-4 justify-center">
            <div class="flex">
              <TIcon name="chat" class="h-6 w-6 hover:text-primary" />
              <span>{{ item.commentsCount }}</span>
            </div>
          </div>
        </div>
        <div class="flex-grow mt-4 md:mt-0 flex justify-center md:justify-end">
          <TSignature :item="item" />
        </div>
      </div>
    </div>

    <div class="mt-8"></div>

    <TCardList
      :collection="collection"
      title="Comments"
      add="Add a comment"
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
        <div class="card-item border">
          <div class="p-4">
            <TPreview class="mt-2" :content="item.body" />
          </div>
          <div class="bg-gray-200 border-t px-4 py-4 flex items-center">
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
            <div class="flex-grow flex justify-end">
              <TSignature :item="item" />
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { Microlink } from '@microlink/vue'
import { computed } from '@vue/composition-api'
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TButton from '~/components/TButton'
import TLoader from '~/components/TLoader'
import TIcon from '~/components/TIcon'
import TSignature from '~/components/TSignature'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useComments from '~/use/comments'

export default {
  name: 'PostView',
  components: {
    TLoader,
    TCardList,
    TPreview,
    TButton,
    TIcon,
    TSignature,
    Microlink
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
      can
    }
  }
}
</script>
