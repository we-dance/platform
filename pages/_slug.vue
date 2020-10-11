<template>
  <div :class="classes">
    <nuxt-content :document="page" />
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    const slug = params.slug

    let page = {}

    try {
      page = await $content(slug).fetch()
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' })
    }

    return {
      page
    }
  },
  computed: {
    classes() {
      let classes = this.page.container || 'p-4 mx-auto max-w-3xl '

      classes += this.page.notypo ? '' : 'typo'

      return classes
    }
  }
}
</script>
