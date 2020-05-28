<template>
  <div class="mx-auto w-full max-w-lg">
    <TTabs v-model="selectedType" :tabs="types" />
    <TForm
      v-model="item"
      :fields="fields"
      vertical
      show-cancel
      :show-remove="can('remove', collection, item)"
      class="rounded bg-white mb-4 shadow border p-4 rounded-t-none"
      @save="saveItem"
      @cancel="cancelItem"
      @remove="removeItem"
    />
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useTags from '~/use/tags'
import useRouter from '~/use/router'

export default {
  name: 'PostEdit',
  layout: 'minimal',
  middleware: ['auth'],
  data: () => ({
    selectedType: 'post'
  }),
  computed: {
    fields() {
      return this.types.find((f) => f.value === this.selectedType).fields
    }
  },
  mounted() {
    if (this.$route.query.tag) {
      this.item = this.item || { tags: {} }
      this.item.tags[this.$route.query.tag] = true
    }
  },
  methods: {
    cancelItem() {
      if (this.id) {
        this.$router.push(`/posts/${this.id}`)
      } else {
        this.$router.push(`/`)
      }
    },
    async saveItem(data) {
      if (data.id) {
        await this.update(data.id, data)
      } else {
        await this.create(data)
      }

      this.cancelItem()
    },
    async removeItem(id) {
      await this.remove(id)
      this.cancelItem()
    }
  },
  setup() {
    const { can } = useAuth()
    const { params } = useRouter()

    const collection = 'posts'

    const { doc: item, id, load, update, remove, create } = useDoc(collection)
    const { tagsOptions, addTag } = useTags()

    const types = computed(() => [
      {
        label: 'Post',
        value: 'post',
        fields: [
          {
            name: 'title',
            hideLabel: true,
            placeholder: 'Title'
          },
          {
            name: 'description',
            hideLabel: true,
            type: 'markdown'
          },
          {
            name: 'tags',
            hideLabel: true,
            placeholder: 'Tags',
            type: 'tags',
            options: tagsOptions.value,
            'v-on:add': addTag
          }
        ]
      },
      {
        label: 'Link',
        value: 'link',
        fields: [
          {
            name: 'title',
            hideLabel: true,
            placeholder: 'Title'
          },
          {
            name: 'link',
            hideLabel: true,
            placeholder: 'Link'
          },
          {
            name: 'tags',
            hideLabel: true,
            type: 'tags',
            options: tagsOptions.value,
            'v-on:add': addTag
          }
        ]
      }
    ])

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      item,
      id,
      can,
      collection,
      update,
      remove,
      create,
      types
    }
  }
}
</script>
