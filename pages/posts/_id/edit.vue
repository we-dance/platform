<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <div class="flex justify-between m-4">
        <div class="font-bold">Write a new post</div>
        <button class="cursor-pointer" @click="$router.back()">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>

      <TForm
        v-model="item"
        :edit-creator="isAdmin()"
        :fields="fields"
        vertical
        :show-cancel="!!id"
        :show-remove="!!id"
        :submit-label="id ? 'Save' : 'Add'"
        class="bg-white p-4 space-y-4"
        @save="saveItem"
        @cancel="cancelItem"
        @remove="removeItem"
      />
    </div>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useTags } from '~/use/tags'
import { useRouter } from '~/use/router'

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
  watch: {
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'posts', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }
      }
    }
  },
  mounted() {
    const city = ls('city')

    this.item = this.item || {
      community: city
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
      if (!data.title) {
        return
      }

      if (data.id) {
        this.$fire.analytics.logEvent('update_post')
        await this.update(data.id, data)
      } else {
        this.$fire.analytics.logEvent('create_post')
        await this.create(data)
      }

      this.cancelItem()
    },
    async removeItem(id) {
      this.$fire.analytics.logEvent('delete_post')
      await this.remove(id)
      this.cancelItem()
    }
  },
  setup() {
    const { can, profile, isAdmin } = useAuth()
    const { params } = useRouter()

    const collection = 'posts'

    const { doc: item, id, load, update, remove, create, loading } = useDoc(
      collection
    )
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
            placeholder: 'Text (markdown)',
            tips:
              'Pitch yourself: Who are you? What do you offer? What do you want?\n\nTips for effective pitch:\n- Uncomplicated: It should be catchy and roll off the tongue\n- Concise: It shouldn’t take more than a minute to say or read\n- Unique: It reflects your skills, goals, and desires\n- Storyline: It covers who you are, what you offer, and where you want to be\n- Appealing: Your elevator pitch is essentially a persuasive sales pitch; the emphasis should be on what you offer',
            description:
              'Use [widgets](https://wedance.vip/markdown), including images and videos'
          },
          {
            name: 'place',
            type: 'place'
          },
          {
            name: 'styles',
            label: 'Styles',
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
      loading,
      item,
      id,
      can,
      collection,
      update,
      remove,
      create,
      types,
      profile,
      isAdmin
    }
  }
}
</script>
