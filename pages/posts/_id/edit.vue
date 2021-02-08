<template>
  <div class="mx-auto w-full max-w-lg">
    <div class="flex justify-between m-4">
      <div class="font-bold">Write a new post</div>
      <button class="cursor-pointer" @click="$router.back()">
        <TIcon name="close" class="cursor-pointer w-4 h-4" />
      </button>
    </div>

    <TForm
      v-model="item"
      :fields="fields"
      vertical
      :show-cancel="!!id"
      :show-remove="!!id"
      :submit-label="id ? 'Save' : 'Add'"
      class="bg-white p-4"
      @save="saveItem"
      @cancel="cancelItem"
      @remove="removeItem"
    />

    <nuxt-content :document="newPostWidget" class="my-8 typo" />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useTags from '~/use/tags'
import useRouter from '~/use/router'

export default {
  name: 'PostEdit',
  layout: 'empty',
  middleware: ['auth'],
  async asyncData({ $content }) {
    let newPostWidget = ''
    try {
      newPostWidget = await $content('widgets/newpost').fetch()
    } catch (e) {
      console.error(e)
    }

    return {
      newPostWidget
    }
  },
  data: () => ({
    selectedType: 'post'
  }),
  computed: {
    fields() {
      return this.types.find((f) => f.value === this.selectedType).fields
    }
  },
  mounted() {
    const city = ls('city')

    this.item = this.item || {
      tags: {},
      community: city,
      cover: this.profile.photo
    }

    if (this.$route.query.tag) {
      this.item.tags[this.$route.query.tag] = true
    }
  },
  methods: {
    cancelItem() {
      if (this.id) {
        this.$router.push(`/posts/${this.id}`)
      } else {
        this.$router.push(`/feed`)
      }
    },
    async saveItem(data) {
      if (!data.title || !data.description) {
        return
      }

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
    const { can, profile } = useAuth()
    const { params } = useRouter()

    const collection = 'posts'

    const { doc: item, id, load, update, remove, create } = useDoc(collection)
    const { tagsOptions, addTag } = useTags()

    const types = computed(() => [
      {
        label: 'Text',
        value: 'post',
        fields: [
          {
            name: 'cover',
            type: 'photo',
            width: 500,
            height: 500,
            circle: false,
            hideLabel: true
          },
          {
            name: 'title',
            hideLabel: true,
            placeholder: 'Title'
          },
          {
            name: 'description',
            hideLabel: true,
            type: 'textarea',
            placeholder: 'Text (markdown)'
          },
          {
            name: 'community',
            type: 'city'
          },
          {
            name: 'styles',
            label: 'Dance styles',
            type: 'stylesSelect'
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
            listeners: {
              add: addTag
            }
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
      types,
      profile
    }
  }
}
</script>
