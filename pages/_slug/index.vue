<template>
  <div :class="classes">
    <nuxt-content v-if="page" :document="page" />
    <TProfile v-else-if="profile" :profile="profile" />
  </div>
</template>

<script>
export default {
  name: 'Slug',
  async asyncData({ app, $content, params, error }) {
    const slug = params.slug

    let page = null
    let profile = null
    let pageFound = false
    let profileFound = false

    try {
      page = await $content(slug).fetch()
      pageFound = true
    } catch (e) {}

    if (!pageFound) {
      const collection = await app.$fire.firestore
        .collection('profiles')
        .where('username', '==', slug)
        .get()

      if (collection.docs.length > 0) {
        const doc = collection.docs[0]

        profile = doc.data()
        profile.id = doc.id

        profileFound = true
      }
    }

    if (!pageFound && !profileFound) {
      error({ statusCode: 404 })
    }

    return {
      page,
      profile
    }
  },
  computed: {
    classes() {
      let classes = 'mx-auto max-w-md '

      if (this.page) {
        classes += this.page.container + ' '
        classes += this.page.notypo ? '' : 'typo'
      }

      return classes
    }
  }
}
</script>
