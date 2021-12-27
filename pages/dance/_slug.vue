<template>
  <div>
    <div class="typo p-4 border-b">
      <h1>{{ page.name }}</h1>
      <p v-if="page.synonyms" class="italic">
        Also known as {{ page.synonyms }}
      </p>

      <div>
        <span class="font-bold">Family</span>
        <span class="leading-loose">
          <router-link :to="`/dance/${page.family}`">{{
            page.family
          }}</router-link></span
        >
      </div>

      <div>
        <span class="font-bold">Related</span>
        <span v-for="style in related" :key="style.name" class="p-1">
          <router-link :to="`/dance/${style.name}`">{{
            style.name
          }}</router-link
          >{{ ' ' }}
        </span>
      </div>

      <table class="mt-4 min-w-full divide-y divide-gray-200">
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <th
              class="bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Region
            </th>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ page.region }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Country
            </th>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ page.country }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ page.type }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Year
            </th>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ page.year }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <a target="_blank" :href="page.source">Source</a>
      </div>
    </div>
    <TPostList
      :where="{ [`styles.${page.name}.selected`]: true }"
      orderBy="star.count"
    />
  </div>
</template>

<script>
export default {
  name: 'DancePage',
  async asyncData({ $content, params, error }) {
    const slug = params.slug

    let page = null
    let related = null
    let pageFound = false

    try {
      page = await $content(`styles/${slug}`).fetch()
      related = await $content(`styles`)
        .where({ family: page.family })
        .fetch()
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
}
</script>
