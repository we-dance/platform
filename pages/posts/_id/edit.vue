<template>
  <div class="min-h-screen bg-dark md:py-4">
    <div
      class="mx-auto w-full max-w-lg bg-white md:rounded md:border md:shadow"
    >
      <div class="m-4 flex justify-between">
        <TInputButtons
          value="posts"
          :options="[
            {
              label: $t('feed.post'),
              value: 'posts',
              to: `/posts/${item.id || '-'}/edit`,
            },
            {
              label: $t('feed.event'),
              value: 'events',
              to: `/events/${item.id || '-'}/edit`,
            },
          ]"
        />

        <button class="cursor-pointer" @click="$router.back()">
          <TIcon name="close" class="h-4 w-4 cursor-pointer" />
        </button>
      </div>

      <TForm
        v-model="item"
        :edit-creator="isAdmin()"
        :fields="postFields"
        vertical
        show-cancel
        class="space-y-4 bg-white p-4"
        @save="saveItem"
        @cancel="cancelItem"
      />
    </div>
  </div>
</template>

<script>
import ls from 'local-storage'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
import { usePosts } from '~/use/posts'
import { track } from '~/plugins/firebase'

export default {
  name: 'PostEdit',
  layout: 'empty',
  middleware: ['auth'],
  watch: {
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'posts', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }
      }
    },
  },
  mounted() {
    const city = ls('city')

    this.item = this.item || {
      community: city,
    }
  },
  methods: {
    cancelItem() {
      this.$router.push(`/feed`)
    },
    async saveItem(data) {
      if (data.id) {
        track('update_post')
        await this.update(data.id, data)
      } else {
        track('create_post')
        await this.create(data)
      }

      this.cancelItem()
    },
  },
  setup() {
    const { can, profile, isAdmin } = useAuth()
    const { params } = useRouter()
    const { postFields } = usePosts()

    const collection = 'posts'

    const {
      doc: item,
      id,
      load,
      update,
      remove,
      create,
      loading,
    } = useDoc(collection)

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      item,
      id,
      can,
      collection,
      update,
      remove,
      create,
      profile,
      postFields,
      isAdmin,
    }
  },
}
</script>
