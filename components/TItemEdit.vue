<template>
  <div class="bg-dark md:py-4 min-h-screen">
    <TLoader v-if="loading" />
    <div
      v-else
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <div class="flex justify-between m-4">
        <div class="font-bold">{{ title }}</div>
        <TButton
          icon="close"
          type="icon"
          class="cursor-pointer w-4 h-4"
          :to="indexUrl"
        />
      </div>

      <TForm
        v-if="item !== null"
        v-model="item"
        :fields="fields"
        vertical
        :show-cancel="!!id"
        :show-remove="!!id"
        :submit-label="id ? saveLabel : addLabel"
        :edit-creator="editCreator"
        class="p-4"
        @save="saveItem"
        @cancel="cancelItem"
        @remove="removeItem"
      />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRouter from '~/use/router'

export default {
  name: 'TItemEdit',
  props: {
    title: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    },
    singular: {
      type: String,
      default: ''
    },
    indexUrl: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    defaults: {
      type: Object,
      default: () => {}
    },
    saveLabel: {
      type: String,
      default: 'Save'
    },
    addLabel: {
      type: String,
      default: 'Add'
    },
    editCreator: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isAllowed(isAllowed) {
      if (!isAllowed) {
        this.$nuxt.error({ statusCode: 405 })
      }
    }
  },
  mounted() {
    this.item = this.item || this.defaults
  },
  methods: {
    cancelItem() {
      if (this.id) {
        this.$router.push(`${this.indexUrl}/${this.id}`)
      } else {
        this.$router.push(this.indexUrl)
      }
    },
    async saveItem(data) {
      if (data.id) {
        this.$fire.analytics.logEvent(`update_${this.singular}`)
        await this.update(data.id, data)
      } else {
        this.$fire.analytics.logEvent(`create_${this.singular}`)
        await this.create(data)
      }

      this.cancelItem()
    },
    async removeItem(id) {
      this.$fire.analytics.logEvent(`delete_${this.singular}`)
      await this.remove(id)
      this.cancelItem()
    }
  },
  setup(props) {
    const { can, profile } = useAuth()
    const { params } = useRouter()

    const {
      doc: item,
      id,
      load,
      update,
      remove,
      create,
      loading: loadingDoc
    } = useDoc(props.collection)

    const loading = computed(() => loadingDoc.value || !profile.value?.username)
    const isAllowed = computed(
      () => can('edit', props.collection, item.value) || loading
    )

    if (params.id !== '-') {
      load(params.id)
    }

    return {
      loading,
      item,
      id,
      can,
      update,
      remove,
      create,
      isAllowed
    }
  }
}
</script>
