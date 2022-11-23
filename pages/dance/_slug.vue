<template>
  <div>
    <div class="typo p-4 border-b">
      <h1>{{ page.name }}</h1>
      <p v-if="page.synonyms" class="italic">
        Also known as {{ page.synonyms }}
      </p>
      <div class="flex space-x-2">
        <a
          href="https://docs.google.com/spreadsheets/d/1oCLW_c_Jr021AT6_gGngtFB94P_5ftSCJGp-XqdvRaM/edit#gid=0"
          target="_blank"
          >Edit this page</a
        >
        <span>•</span>
        <NuxtLink to="/dance" class="block">List of all dance styles</NuxtLink>
      </div>

      <div class="mt-4">
        <span class="font-bold">Family</span>
        <span class="leading-loose">
          <NuxtLink :to="`/dance/${page.family}`">{{
            page.family
          }}</NuxtLink></span
        >
      </div>

      <div>
        <span class="font-bold">Related</span>
        <span v-for="style in related" :key="style.name" class="p-1">
          <NuxtLink :to="`/dance/${style.id}`">{{ style.name }}</NuxtLink
          >{{ ' ' }}
        </span>
      </div>

      <table class="mt-4 min-w-full divide-y divide-gray-200">
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <th
              class="bg-gray-100 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Region
            </th>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ page.region }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Origins
            </th>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ page.origins }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Parent
            </th>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ page.parent }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ page.type }}
            </td>
          </tr>

          <tr>
            <th
              class="bg-gray-100 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Year
            </th>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ page.year }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="page.description" class="mt-4">
        {{ page.description }}
      </div>

      <div v-if="page.history" class="mt-4">
        <h2>History</h2>
        <div v-if="page.history">{{ page.history }}</div>
      </div>

      <div class="mt-4 flex justify-end">
        <a target="_blank" :href="page.source">Source</a>
      </div>
    </div>
    <TPostList :filter="{ [`styles.${page.name}.selected`]: true }" />
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
