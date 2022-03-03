<template>
  <div class="min-h-screen bg-dark md:py-4">
    <div
      class="mx-auto w-full max-w-lg bg-white md:rounded md:border md:shadow"
    >
      <div class="m-4 flex justify-between">
        <div class="font-bold">Edit profile</div>
        <button class="cursor-pointer" @click="$router.back()">
          <TIcon name="close" class="h-4 w-4 cursor-pointer" />
        </button>
      </div>

      <TForm
        v-model="item"
        :fields="profileFields"
        vertical
        show-remove
        class="space-y-4 bg-white p-4"
        @save="saveItem"
      />
    </div>
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useProfiles } from '~/use/profiles'

export default {
  name: 'ProfileEdit',
  layout: 'empty',
  middleware: ['auth'],

  async asyncData({ app, params, error }) {
    const slug = params.slug

    let profile = null
    let profileFound = false
    let id = null

    const collection = await db
      .collection('profiles')
      .where('username', '==', slug)
      .get()

    if (collection.docs.length > 0) {
      const doc = collection.docs[0]

      profile = doc.data()
      id = doc.id

      profileFound = true
    }

    if (!profileFound) {
      error({ statusCode: 404 })
    }

    return {
      item: profile,
      id,
    }
  },
  mounted() {
    if (!this.can('edit', 'profiles', this.item)) {
      this.$nuxt.error({ statusCode: 405 })
    }
  },
  methods: {
    async saveItem(data) {
      await this.update(this.id, data)
      this.$router.push(`/${this.item.username}`)
    },
  },
  setup() {
    const { can } = useAuth()
    const { profileFields, contactFields } = useProfiles()
    const { update } = useDoc('profiles')

    return {
      update,
      profileFields,
      contactFields,
      can,
    }
  },
}
</script>
