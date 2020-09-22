<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Event not found
  </div>
  <div v-else>
    <div class="bg-dark text-real-white pt-16">
      <div class="mt-8 px-4 mx-auto max-w-2xl text-center">
        <TStyles :value="item.styles" />
        <h1 class="mt-4 text-4xl font-bold leading-tight">
          {{ item.name }}
        </h1>
        <p v-if="item.organiser" class="mt-2 text-xl">
          by {{ item.organiser }}
        </p>
        <div>
          <TButton
            v-if="item.response === 'up'"
            class="mt-4 mr-4"
            type="success"
            @click="updateRsvp(item.id, 'events', 'down')"
            >You are going</TButton
          >
          <TButton
            v-else
            class="mt-4 mr-4"
            type="danger"
            @click="updateRsvp(item.id, 'events', 'up')"
            >Register</TButton
          >
        </div>
        <div class="mt-8 pb-4">
          <p v-if="item.address">Address: {{ item.address }}</p>
          <p v-else>Online Event</p>
          <p v-if="item.price">Price: {{ item.price }}</p>
          <p>Start: {{ getDateTime(item.startDate) }}</p>
          <p>End: {{ getDateTime(item.endDate) }}</p>
        </div>
      </div>
    </div>
    <div class="mx-auto max-w-md">
      <div class="bg-white p-4">
        <div>
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
                  v-if="item.response === 'up'"
                  type="success"
                  @click="updateRsvp(item.id, 'events', 'down')"
                >
                  You are going
                </TButton>
                <TButton
                  v-else
                  type="danger"
                  @click="updateRsvp(item.id, 'events', 'up')"
                >
                  Register
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
  layout: 'public',
  data: () => ({
    comment: ''
  }),
  computed: {
    tweetUrl() {
      const app = process.env.app

      const url = app.url + this.$route.fullPath

      const text = encodeURI(`"${this.item.name}"`)

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
