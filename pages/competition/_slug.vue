<template>
  <div>
    <TwTabs
      :tabs="[
        {
          name: 'Competition',
          to: localePath('/competition'),
          current: slug === 'index',
        },
        {
          name: 'Partners',
          to: localePath('/competition/partners'),
          current: slug === 'partners',
        },
      ]"
      class="border-b"
    />
    <nuxt-content :document="page" class="p-4 typo" />
  </div>
</template>

<script>
export default {
  name: 'CompetitionPage',
  layout: 'full',
  async asyncData({ $content, params, error, redirect }) {
    const slug = params.slug || 'index'

    let page = null
    let pageFound = false

    try {
      page = await $content('competition/' + slug).fetch()
      pageFound = true
    } catch (e) {}

    if (!pageFound) {
      error({ statusCode: 404 })
    }

    return {
      slug,
      page,
    }
  },
}
</script>
