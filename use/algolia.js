import algoliasearch from 'algoliasearch/lite'
import { ref } from 'vue-demi'

export function useAlgolia(indexName) {
  const loading = ref(true)
  const response = ref({})
  const page = ref(0)
  const cachedOptions = ref({})

  const client = algoliasearch('EUEL97WVQN', 'd3a3895bb75ee6d814a4402158745e65')

  const index = client.initIndex(indexName)

  async function search(query, options) {
    cachedOptions.value = options
    loading.value = false
    response.value = await index.search(query, options)
    return response.value
  }

  async function loadMore() {
    page.value++
    const options = { ...cachedOptions.value, page: page.value }
    const moreResults = await index.search(response.value.query, options)

    response.value.hits = [...response.value.hits, ...moreResults.hits]
    response.value.page = moreResults.page
  }

  return {
    response,
    search,
    loadMore,
    loading,
  }
}
