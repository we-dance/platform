<template>
  <div class="p-4">
    <div v-if="!loading && item" class="card-item p-4 border">
      <div>
        <TSignature :item="item" />

        <div class="font-bold text-xl mb-2">
          {{ item.title }}
        </div>
        <TPreview class="mb-2" :content="item.description" />
      </div>
      <div class="flex leading-none">
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

    <div class="mt-8"></div>

    <TCardList
      :collection="collection"
      title="Comments"
      add="Add a comment"
      :fields="fields"
      :map="map"
      :filters="filters"
    >
      <template v-slot:default="{ item }">
        <div class="card-item p-4 border">
          <TSignature :item="item" />
          <TPreview class="mb-2" :content="item.body" />
          <div class="flex leading-none">
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
</template>

<script>
import { computed } from '@vue/composition-api'
import TCardList from '~/components/TCardList'
import TPreview from '~/components/TPreview'
import TIcon from '~/components/TIcon'
import TSignature from '~/components/TSignature'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useComments from '~/use/comments'

export default {
  components: {
    TCardList,
    TPreview,
    TIcon,
    TSignature
  },
  setup() {
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

    const { doc, load, loading } = useDoc('posts')

    load(params.id)

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

      return {
        ...item,
        upVotes,
        downVotes,
        votes,
        response,
        order
      }
    }

    const item = computed(() => map(doc.value))

    return {
      loading,
      filters,
      item,
      collection,
      fields,
      map,
      getCount,
      getRsvpResponse,
      updateRsvp,
      getCommentsCount
    }
  }
}
</script>
