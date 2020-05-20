<template>
  <div class="mx-auto w-full max-w-lg">
    <div class="flex">
      <button
        v-for="type in types"
        :key="type.value"
        class="border border-gray-200 w-full rounded-t focus:outline-none hover:bg-gray-100"
        @click="selectedType = type.value"
      >
        <div class="p-2">
          {{ type.label }}
        </div>
        <div
          v-if="selectedType === type.value"
          class="border-b-2 border-blue-500"
        ></div>
      </button>
    </div>
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
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRouter from '~/use/router'
import TForm from '~/components/TForm'
import TFieldTag from '~/components/TFieldTag'

export default {
  name: 'PostEdit',
  layout: 'minimal',
  middleware: ['auth'],
  components: {
    TForm
  },
  data: () => ({
    selectedType: 'post',
    types: [
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
            component: TFieldTag
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
            placeholder: 'Tags',
            component: TFieldTag
          }
        ]
      }
    ]
  }),
  computed: {
    fields() {
      return this.types.find((f) => f.value === this.selectedType).fields
    }
  },
  setup() {
    const { can } = useAuth()
    const { params } = useRouter()

    const collection = 'posts'

    const { doc: item, id, load, update, remove, create } = useDoc(collection)

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
