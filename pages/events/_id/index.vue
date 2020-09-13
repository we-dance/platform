<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Event not found
  </div>
  <div v-else>
    <div class="md:grid grid-cols-12 gap-6">
      <div class="col-span-12 bg-white rounded p-4">
        <div>
          <TTagsPreview :value="item.tags" />

          <h1 class="font-bold text-2xl mb-2 leading-tight">
            {{ item.name }}
          </h1>

          <TPreview class="mt-2" :content="item.description" />

          <div v-if="can('edit', 'events', item)" class="my-2 flex items-start">
            <TButton
              icon="edit"
              :to="`/events/${item.id}/edit`"
              class="hover:text-blue-500"
              label="Edit"
            />
          </div>

          <div class="flex justify-between items-center border p-4 my-4">
            <div class="flex">
              <div class="text-green-500 flex justify-center">
                <TButton
                  :class="{ 'text-green-700': item.response === 'up' }"
                  @click="updateRsvp(item.id, 'events', 'up')"
                >
                  I am going
                </TButton>
              </div>
            </div>
            <div>
              <TButton :href="tweetUrl">Share</TButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useProfiles from '~/use/profiles'
import useReactions from '~/use/reactions'
import { getDateTime, dateDiff } from '~/utils'

export default {
  layout: 'minimal',
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
    const { getProfile } = useProfiles()

    const { doc, load, exists, loading } = useDoc('events')
    const { map } = useReactions()

    const { updateRsvp } = useRSVP()

    if (params.id) {
      load(params.id)
    }

    const item = computed(() => map(doc.value))

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
}
</script>
