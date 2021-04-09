import algoliasearch from 'algoliasearch/lite'
import { ref } from 'vue-demi'

export function useAlgolia(indexName) {
  const items = ref([])
  const client = algoliasearch('EUEL97WVQN', 'd3a3895bb75ee6d814a4402158745e65')

  const index = client.initIndex(indexName)

  async function search(query, options) {
    console.log('search', query, options)
    const { hits } = await index.search(query, options)
    items.value = hits
  }

  return {
    items,
    search
  }
}
