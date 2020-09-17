<template>
  <main>
    <div class="mb-4">
      <TButton @click="importAsset">Update styles</TButton>
    </div>
    <pre v-if="!loading">{{ doc }}</pre>
  </main>
</template>

<script>
import stylesAsset from '~/assets/content/styles'
import useDoc from '~/use/doc'

export default {
  setup() {
    const { set, doc, loading, load } = useDoc('settings')

    load('styles')

    return {
      set,
      doc,
      loading,
      load
    }
  },
  methods: {
    importAsset() {
      const names = Object.keys(stylesAsset)
      const styles = {}

      names.forEach((id) => {
        const item = {
          id,
          ...stylesAsset[id]
        }

        styles[id] = item
      })

      this.set('styles', styles)

      this.load('styles')
    }
  }
}
</script>
