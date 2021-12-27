import { computed, reactive, toRefs, watch } from '@nuxtjs/composition-api'

export const useDocs = (collection) => {
  const state = reactive({
    docs: [],
    loaded: false,
    last: null,
    listeners: [],
  })

  function detachListeners() {
    state.listeners.forEach((listener) => listener())
  }

  function load(currentCollection) {
    detachListeners()

    const listener = currentCollection.onSnapshot((snapshot) => {
      state.docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      state.last = snapshot.docs[snapshot.docs.length - 1]
      state.loaded = true
    })

    state.listeners.push(listener)
  }

  load(collection)

  const loadMore = () => {
    const nextCollection = collection.startAfter(state.last)

    const listener = nextCollection.onSnapshot((snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      state.docs.push(...docs)

      state.last = snapshot.docs[snapshot.docs.length - 1]
    })

    state.listeners.push(listener)
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
