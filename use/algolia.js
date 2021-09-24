import algoliasearch from 'algoliasearch/lite'
import { ref } from 'vue-demi'

export function useAlgolia(indexName) {
  const response = ref({})
  const client = algoliasearch('EUEL97WVQN', 'd3a3895bb75ee6d814a4402158745e65')

  const index = client.initIndex(indexName)

  async function search(query, options) {
    response.value = await index.search(query, options)
  }

  return {
    response,
    search,
  }
}
