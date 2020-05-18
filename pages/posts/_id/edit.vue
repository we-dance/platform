<template>
  <div>
    <TForm
      v-model="item"
      :fields="fields"
      show-cancel
      :show-remove="can('remove', collection, item)"
      class="card-item p-4"
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

export default {
  name: 'PostEdit',
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
        name: 'description',
        label: 'Description',
        type: 'markdown'
      },
      {
        name: 'link',
        label: 'Link'
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
  methods: {
    cancelItem() {
      this.$router.push(`/posts/${this.id}`)
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
      this.$router.push(`/posts`)
    }
  }
}
</script>
