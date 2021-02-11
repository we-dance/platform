<template>
  <div class="mx-auto max-w-md bg-white px-4">
    <portal to="title">
      <router-link to="/" class="flex">
        <TIcon name="icon" size="8" />
        <h1 class="ml-1 font-lato font-bold">{{ profile.username }}</h1>
      </router-link>
    </portal>

    <TButtonShare
      :url="`https://wedance.vip/u/${profile.username}`"
      :text="`WeDance: ${profile.username} is looking for a dance partner`"
      :file="profile.socialCover"
      :file-name="profile.username"
    />

    <TProfileDancer :profile="profile" />

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
  layout: 'default',
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
  }
}
</script>
