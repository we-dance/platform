<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="p-4 border-b">
      <h1 class="text-2xl font-bold">
        {{ page.name }}
      </h1>

      <div v-if="page.synonyms" class="text-sm">
        Also known as {{ page.synonyms }}
      </div>
    </div>

    <TExpand>
      <div class="p-4 border-b">
        <dl class="grid grid-cols-3 gap-1 mt-4 min-w-full">
          <div class="col-span-2 border rounded px-3 py-2">
            <dt
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Music
            </dt>
            <dd class="text-sm text-gray-900">
              {{ page.music }}
            </dd>
          </div>

          <div class="border rounded px-3 py-2">
            <dt
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </dt>
            <dd class="text-sm text-gray-900">
              {{ page.type }}
            </dd>
          </div>

          <div class="border rounded px-3 py-2">
            <dt
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Region
            </dt>
            <dd class="text-sm text-gray-900">
              {{ page.region }}
            </dd>
          </div>

          <div class="border rounded px-3 py-2">
            <dt
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Origins
            </dt>
            <dd class="text-sm text-gray-900">
              {{ page.origins }}
            </dd>
          </div>

          <div class="border rounded px-3 py-2">
            <dt
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Parent
            </dt>
            <dd class="text-sm text-gray-900">
              {{ page.parent }}
            </dd>
          </div>

          <div class="border rounded px-3 py-2">
            <dt
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Year
            </dt>
            <dd class="text-sm text-gray-900">
              {{ page.year }}
            </dd>
          </div>
        </dl>

        <div v-if="page.description" class="mt-4 typo">
          {{ page.description }}
        </div>

        <div v-if="page.history" class="mt-4 bg-gray-100 p-4 rounded">
          <h3 class="uppercase text-xs font-bold">History</h3>
          <div v-if="page.history" class="typo">{{ page.history }}</div>
          <a
            v-if="page.source"
            target="_blank"
            :href="page.source"
            class="text-xs underline text-right"
            >Source</a
          >
        </div>

        <div class="text-xs mt-4">
          <div>
            <span class="font-bold">Family</span>
            <span class="leading-loose">
              <NuxtLink :to="localePath(`/dance/${page.family}`)">{{
                page.family
              }}</NuxtLink></span
            >
          </div>

          <div>
            <span class="font-bold">Related</span>
            <span v-for="style in related" :key="style.name" class="p-1">
              <NuxtLink :to="localePath(`/dance/${style.id}`)">{{
                style.name
              }}</NuxtLink
              >{{ ' ' }}
            </span>
          </div>
        </div>
      </div>
    </TExpand>

    <div class="border-b border-t p-4">
      <form class="flex flex-col gap-4 w-full" @submit.prevent="saveItem">
        <div
          v-if="!showForm"
          class="flex flex-col md:flex-row gap-2 justify-end"
        >
          <TButton
            :to="`/reviews/add?type=link&style=${page.id}&city=`"
            label="Add a recommendation"
          />
          <TButton
            type="primary"
            label="Ask a question"
            @click="showForm = true"
          />
        </div>
        <TField
          v-if="showForm"
          v-model="item.description"
          required
          label-position="top"
          component="TInputTextarea"
          :placeholder="`Ask about ${page.name}`"
        />
        <div v-if="showForm" class="flex justify-end gap-2">
          <TButton xtype="submit" variant="primary">Post</TButton>
        </div>
      </form>
    </div>

    <TStories :dance="page.id" />
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ref } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'

export default {
  name: 'DancePage',
  async asyncData({ $content, params, error }) {
    const slug = params.slug

    let page = null
    let related = null
    let pageFound = false

    try {
      page = await $content(`styles/${slug}`).fetch()

      if (page.family) {
        related = (
          await $content(`styles`)
            .where({ family: page.family })
            .fetch()
        ).filter((style) => style.id !== page.id)
      }

      pageFound = true
    } catch (e) {}

    if (!pageFound) {
      error({ statusCode: 404 })
    }

    return {
      page,
      related,
    }
  },
  methods: {
    async saveItem() {
      let data = this.item
      this.item = {}

      data = {
        ...data,
        place: '',
        dances: [this.page.id],
        createdAt: +new Date(),
        createdBy: this.uid,
        username: this.profile.username,
        type: 'ask-for-recommendations',
      }

      const firestore = firebase.firestore()
      await firestore.collection('stories').add(data)
    },
  },

  head() {
    if (this.page) {
      const page = this.page

      return {
        title: page.title,
        canonical: `/${page.slug}`,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: page.description,
          },
          {
            property: 'og:type',
            content: 'article',
            hid: 'og:type',
          },
          {
            property: 'og:title',
            content: page.title,
            hid: 'og:title',
          },
          {
            property: 'og:description',
            content: page.description,
            hid: 'og:description',
          },
        ],
      }
    }
  },
  setup() {
    const { uid, profile } = useAuth()
    const item = ref({})
    const showForm = ref(false)

    return {
      showForm,
      item,
      profile,
      uid,
    }
  },
}
</script>
