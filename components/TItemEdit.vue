<template>
  <TLoader v-if="loading" />
  <div v-else>
    <div v-if="indexUrl" class="flex justify-between m-4">
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
      :show-cancel="exists"
      :show-remove="showRemove"
      :submit-label="exists ? saveLabel : addLabel"
      :edit-creator="editCreator"
      class="p-4 space-y-4"
      @save="saveItem"
      @cancel="cancelItem"
      @remove="removeItem"
    />
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { track } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'

export default {
  name: 'TItemEdit',
  components: {
    TForm: () => import(/* webpackChunkName: "TForm" */ '~/components/TForm'),
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    collection: {
      type: String,
      default: '',
    },
    singular: {
      type: String,
      default: '',
    },
    indexUrl: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: () => [],
    },
    defaults: {
      type: Object,
      default: () => {},
    },
    saveLabel: {
      type: String,
      default: 'Save',
    },
    addLabel: {
      type: String,
      default: 'Add',
    },
    editCreator: {
      type: Boolean,
      default: false,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isAllowed(isAllowed) {
      if (!isAllowed) {
        this.$nuxt.error({ statusCode: 405 })
      }
    },
  },
  mounted() {
    this.item = this.item || this.defaults
  },
  methods: {
    cancelItem() {
      this.$emit('cancel')

      if (this.indexUrl) {
        if (this.id) {
          this.$router.push(`${this.indexUrl}/${this.id}`)
        } else {
          this.$router.push(this.indexUrl)
        }
      }
    },
    async saveItem(data) {
      if (data.id) {
        if (this.singular) {
          track(`update_${this.singular}`)
        }
        await this.update(data.id, data)
      } else {
        if (this.singular) {
          track(`create_${this.singular}`)
        }
        await this.create(data)
      }

      this.$emit('save')

      this.cancelItem()
    },
    async removeItem(id) {
      if (this.singular) {
        track(`delete_${this.singular}`)
      }
      await this.remove(id)
      this.cancelItem()
    },
  },
  setup(props) {
    const { can, profile } = useAuth()
    const { params } = useRouter()

    let itemId = props.id || params.id

    if (itemId === '-') {
      itemId = null
    }

    const {
      doc: item,
      load,
      exists,
      update,
      remove,
      create,
      loading: loadingDoc,
    } = useDoc(props.collection)

    const loading = computed(() => loadingDoc.value || !profile.value?.username)
    const isAllowed = computed(
      () => can('edit', props.collection, item.value) || loading
    )

    if (itemId) {
      load(itemId)
    }

    return {
      exists,
      loading,
      item,
      can,
      update,
      remove,
      create,
      isAllowed,
    }
  },
}
</script>
