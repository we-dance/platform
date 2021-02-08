<template>
  <div class="mx-auto max-w-md bg-white px-4">
    <TButtonShare
      :url="`https://wedance.vip/u/${profile.username}`"
      :text="`WeDance: ${profile.username} is looking for a dance partner`"
      :file="profile.socialCover"
      :file-name="profile.username"
    />

    <TProfileOrganiser v-if="profile.type === 'Organiser'" :profile="profile" />
    <TProfileDancer v-else :profile="profile" />

    <TShareGenerator
      :id="profile.id"
      collection="profiles"
      :title="profile.username"
      :value="profile.socialCover"
    />
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  layout: 'public',
  async asyncData({ app, params, error }) {
    const collection = await app.$fire.firestore
      .collection('profiles')
      .where('username', '==', params.id)
      .get()

    if (!collection.docs.length) {
      error({ statusCode: 404 })
    }

    const doc = collection.docs[0]

    const profile = doc.data()
    profile.id = doc.id

    return {
      profile
    }
  },
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  },
  mounted() {
    if (this.uid) {
      this.$nuxt.setLayout('default')
    }
  }
}
</script>
