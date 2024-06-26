<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <div class="flex justify-end m-4">
        <button class="cursor-pointer" @click="$router.back()">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>

      <TForm
        v-model="item"
        :fields="postFields"
        vertical
        show-cancel
        class="bg-white p-4 space-y-4"
        @save="saveItem"
        @cancel="cancelItem"
      />
    </div>
  </div>
</template>

<script>
import { until } from '@vueuse/core'
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
import { usePosts } from '~/use/posts'
import { db } from '~/plugins/firebase'

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
  methods: {
    cancelItem() {
      this.$router.go(-1)
    },
    async saveItem(data) {
      if (data.id) {
        this.$track('update_post')
        await this.update(data.id, data)
        await db
          .collection('stories')
          .doc(data.id)
          .set(data)
      } else {
        this.$track('create_post')
        await this.create(data)
      }

      this.cancelItem()
    },
  },
  setup() {
    const { can, profile, isAdmin } = useAuth()
    const { params } = useRouter()
    const { postFields } = usePosts()
    const loading = ref(true)

    const collection = 'posts'

    const { doc: item, id, load, update, remove, create } = useDoc(collection)

    onMounted(async () => {
      await until(profile).not.toBeNull()

      if (params.id !== '-') {
        load(params.id)
        await until(item).not.toBeNull()
      }

      loading.value = false
    })

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
