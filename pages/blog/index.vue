<template>
  <div class="p-4">
    <div>
      <h1 class="text-center text-3xl font-bold mb-4">Blog</h1>
      <div class="flex flex-col gap-4">
        <div v-for="page in pages" :key="page.slug">
          <NuxtLink :to="localePath(`/blog/${page.slug}`)">
            <div class="border shadow-sm p-4 rounded-lg">
              <p class="text-xs">
                {{ getDateTimeYear(page.date) }}
              </p>
              <h2 class="text-lg font-bold underline hover:no-underline">
                {{ page.title }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ page.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDateTimeYear } from '~/utils'

export default {
  name: 'Slug',
  layout: 'full',
  async asyncData({ $content, params, error }) {
    const pages = await $content('blog')
      .sortBy('date', 'desc')
      .fetch()

    return {
      pages,
    }
  },
  head() {
    return {
      title: 'Blog',
      canonical: `/blog`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog',
        },
        {
          property: 'og:type',
          content: 'article',
          hid: 'og:type',
        },
        {
          property: 'og:title',
          content: 'Blog',
          hid: 'og:title',
        },
        {
          property: 'og:description',
          content: 'Blog',
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
