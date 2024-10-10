<template>
  <div class="p-4">
    <div>
      <h1 class="text-center text-3xl font-bold">{{ page.title }}</h1>
      <div class="flex justify-end">
        <div class="gap-2 my-2 bg-gray-100 p-2 rounded-lg text-sm">
          <p v-if="page.author">
            Written by
            <NuxtLink
              class="text-primary underline hover:no-underline"
              :to="localePath(`/${page.author}`)"
            >
              {{ page.author }}
            </NuxtLink>
          </p>
          <p v-if="page.date">Published on {{ getDateTimeYear(page.date) }}</p>
        </div>
      </div>
    </div>
    <nuxt-content :document="page" class="typo" />
    <LandingFeature
      v-if="page.cta"
      :title="page.cta.title"
      :description="page.cta.description"
      :button="page.cta.button"
      :url="page.cta.url"
      :button-action="page.cta.action"
    />
  </div>
</template>

<script>
import { getDateTimeYear } from '~/utils'

export default {
  name: 'Slug',
  layout: 'full',
  async asyncData({ $content, params, error }) {
    const slug = params.slug

    let page = null
    let pageFound = false

    try {
      page = await $content('blog/' + slug).fetch()
      pageFound = true
    } catch (e) {}

    if (!pageFound) {
      error({ statusCode: 404 })
    }

    return {
      page,
    }
  },
  head() {
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
  },
  methods: {
    getDateTimeYear,
  },
}
</script>
