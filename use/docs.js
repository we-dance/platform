import { computed, reactive, toRefs } from '@nuxtjs/composition-api'

export const useDocs = (collection) => {
  const state = reactive({
    docs: [],
    loaded: false,
  })

  let last = null
  let listeners = []
  let lastCollection = null

  function detachListeners() {
    listeners.forEach((listener) => listener())
    listeners = []
  }

  function load(currentCollection) {
    detachListeners()

    const listener = currentCollection.onSnapshot((snapshot) => {
      state.docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      last = snapshot.docs[snapshot.docs.length - 1]
      lastCollection = currentCollection

      state.loaded = true
    })

    listeners.push(listener)
  }

  load(collection)

  const loadMore = () => {
    const nextCollection = lastCollection.startAfter(last)

    const listener = nextCollection.onSnapshot((snapshot) => {
      let docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      const ids = state.docs.map((doc) => doc.id)

      docs = docs.filter((doc) => !ids.includes(doc.id))

      state.docs.push(...docs)

      last = snapshot.docs[snapshot.docs.length - 1]
    })

    listeners.push(listener)
  }

  const count = computed(() => Object.keys(state.docs).length)

  return {
    ...toRefs(state),
    count,
    loadMore,
    detachListeners,
    load,
  }
}
