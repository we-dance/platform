<template>
  <TLoader v-if="!loaded" />
  <TEventList
    v-else
    :title="doc.label"
    :docs="items"
    :filter="{ type: 'empty' }"
    class="pb-4"
  />
</template>

<script>
import { loadDocAsync } from '~/utils'

export default {
  name: 'PageListView',
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: null,
      doc: null,
      items: [],
      loaded: false,
    }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.id = this.url.replace('https://wedance.vip/lists/', '')

      this.loaded = false
      this.doc = await loadDocAsync(this.id, 'lists')

      const items = []

      const ids = Object.keys(this.doc.posts)
      for (const id of ids) {
        const doc = await loadDocAsync(id, 'posts')
        items.push(doc)
      }

      this.items = items
      this.loaded = true
    },
  },
}
</script>
