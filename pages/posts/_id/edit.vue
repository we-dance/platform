<template>
  <div class="mx-auto w-full max-w-lg">
    <TForm
      v-model="item"
      :fields="fields"
      vertical
      :show-cancel="id"
      :show-remove="id"
      :submit-label="id ? 'Save' : 'Add'"
      class="bg-white p-4"
      @save="saveItem"
      @cancel="cancelItem"
      @remove="removeItem"
    />
    <div class="p-4 bg-white rounded shadow border">
      <TButton type="nav" @click="selectedType = 'event'">
        <div class="flex justify-center align-middle">
          <TIcon name="calendar" class="w-4 h-4 mr-1" />
          <span>Add event</span>
        </div>
      </TButton>
      <TButton type="nav" @click="selectedType = 'profile'">
        <div class="flex justify-center align-middle">
          <TIcon name="store" class="w-4 h-4 mr-1" />
          <span>Create page</span>
        </div>
      </TButton>
      <TButton type="nav" @click="selectedType = 'dance'">
        <div class="flex justify-center align-middle">
          <TIcon name="search" class="w-4 h-4 mr-1" />
          <span>Find dance partner</span>
        </div>
      </TButton>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
// import useTags from '~/use/tags'
import useRouter from '~/use/router'

export default {
  name: 'PostEdit',
  layout: 'empty',
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
    // const { tagsOptions, addTag } = useTags()

    const types = computed(() => [
      {
        label: 'Post',
        value: 'post',
        fields: [
          {
            name: 'body',
            hideLabel: true,
            placeholder: 'What do you want to talk about?',
            type: 'textarea'
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
