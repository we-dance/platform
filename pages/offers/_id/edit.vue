<template>
  <div class="bg-dark md:py-4">
    <div
      class="mx-auto w-full max-w-lg md:rounded md:border md:shadow bg-white"
    >
      <div class="flex justify-between m-4">
        <div class="font-bold">Edit offer</div>
        <TButton
          icon="close"
          type="icon"
          class="cursor-pointer w-4 h-4"
          to="/offers"
        />
      </div>

      <TForm
        v-model="item"
        :fields="offerFields"
        vertical
        :show-cancel="!!id"
        :show-remove="!!id"
        :submit-label="id ? 'Save' : 'Add'"
        class="bg-white p-4"
        @save="saveItem"
        @cancel="cancelItem"
        @remove="removeItem"
      />
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRouter from '~/use/router'
import { offerFields } from '~/use/offers'

export default {
  name: 'OfferEdit',
  layout: 'empty',
  middleware: ['auth'],
  watch: {
    loading(loading) {
      if (!loading && this.item) {
        if (!this.can('edit', 'offers', this.item)) {
          this.$nuxt.error({ statusCode: 405 })
        }
      }
    }
  },
  mounted() {
    this.item = this.item || {
      city: this.profile?.community,
      partnerBio: this.profile?.partnerBio
    }
  },
  methods: {
    cancelItem() {
      if (this.id) {
        this.$router.push(`/offers/${this.id}`)
      } else {
        this.$router.push(`/`)
      }
    },
    async saveItem(data) {
      if (data.id) {
        this.$fire.analytics.logEvent('update_offer')
        await this.update(data.id, data)
      } else {
        this.$fire.analytics.logEvent('create_offer')
        await this.create(data)
      }

      this.cancelItem()
    },
    async removeItem(id) {
      this.$fire.analytics.logEvent('delete_offer')
      await this.remove(id)
      this.cancelItem()
    }
  },
  setup() {
    const { can, profile } = useAuth()
    const { params } = useRouter()

    const collection = 'offers'

    const { doc: item, id, load, update, remove, create, loading } = useDoc(
      collection
    )

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
      profile,
      offerFields
    }
  }
}
</script>
