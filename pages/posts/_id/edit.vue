<template>
  <div>
    <TForm
      v-model="item"
      :fields="fields"
      show-cancel
      :show-remove="can('remove', collection, item)"
      class="card-item border p-4"
      @save="saveItem"
      @cancel="cancelItem"
      @remove="removeItem"
    />
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRouter from '~/use/router'
import TForm from '~/components/TForm'
import TFieldTag from '~/components/TFieldTag'

export default {
  name: 'PostEdit',
  middleware: ['auth'],
  components: {
    TForm
  },
  setup() {
    const { can } = useAuth()
    const { params } = useRouter()

    const collection = 'posts'

    const { doc: item, id, load, update, remove, create } = useDoc(collection)

    if (params.id !== '-') {
      load(params.id)
    }

    const fields = [
      {
        name: 'title',
        label: 'Title'
      },
      {
        name: 'link',
        label: 'Link'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'markdown'
      },
      {
        name: 'tags',
        label: 'Tags',
        component: TFieldTag
      }
    ]

    return {
      item,
      id,
      can,
      fields,
      collection,
      update,
      remove,
      create
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
  }
}
</script>
