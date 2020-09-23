<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Post not found
  </div>
  <div v-else>
    <div class="md:grid grid-cols-12 gap-6">
      <div class="col-span-12 bg-white rounded p-4">
        <div>
          <TTagsPreview :value="item.tags" />

          <h1 class="font-bold text-2xl mb-2 leading-tight">
            {{ item.title }}
          </h1>

          <div class="flex items-center">
            <TAvatar photo size="sm" :uid="item.createdBy" class="mr-2" />
            <TAvatar name :uid="item.createdBy" />
          </div>

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

      <div id="comment" class="col-span-12" @click="checkAuth">
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
  </div>
</template>

<script>
import { Microlink } from '@microlink/vue'
import {
  computed,
  defineComponent,
  useMeta,
  watchEffect
} from '@nuxtjs/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useProfiles from '~/use/profiles'
import useReactions from '~/use/reactions'
import { getDateTime, dateDiff } from '~/utils'

export default defineComponent({
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

      const author = this.getProfile(this.item.createdBy).name
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
  head() {},
  setup(_, { root }) {
    const { uid, can } = useAuth()
    const { params } = useRouter()
    const { getProfile } = useProfiles()

    const { doc, load, exists, loading } = useDoc('posts')
    const { map } = useReactions()

    const { updateRsvp } = useRSVP()

    if (params.id) {
      load(params.id)
    }

    const item = computed(() => map(doc.value))
    const { title, meta } = useMeta()

    watchEffect(() => {
      title.value = item.value.title
      meta.value = [
        {
          hid: 'description',
          name: 'description',
          content: item.value.excerpt
        },
        {
          name: 'keywords',
          content: item.value.keywords,
          hid: 'keywords'
        },
        {
          property: 'og:title',
          content: item.value.title,
          hid: 'og:title'
        },
        {
          property: 'og:description',
          content: item.value.excerpt,
          hid: 'og:description'
        }
      ]

      root.$meta().refresh()
    })

    return {
      exists,
      uid,
      loading,
      item,
      map,
      updateRsvp,
      can,
      getProfile,
      getDateTime,
      dateDiff
    }
  }
})
</script>
