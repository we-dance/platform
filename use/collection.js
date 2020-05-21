import Vue from 'vue'
import { computed, toRefs } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'

const state = Vue.observable({})

export default (name, filter) => {
  let field = ''
  let value = ''

  if (filter) {
    field = Object.keys(filter)[0]
    value = filter[field]
  }

  const hash = `${name}-${field}-${value}`
  const loadingHash = `${name}-${field}-${value}-loading`

  const firestore = firebase.firestore()
  let collection = firestore.collection(name)

  if (field) {
    collection = collection.where(field, '==', value)
  }

  if (!state[hash]) {
    Vue.set(state, hash, {})
    Vue.set(state, loadingHash, true)

    collection.onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
          Vue.set(state[hash], change.doc.id, change.doc.data())
        }
        if (change.type === 'removed') {
          Vue.delete(state[hash], change.doc.id)
        }
      })

      Vue.set(state, loadingHash, false)
    })
  }

  async function load() {
    const docs = await collection.get()

    Vue.set(state, loadingHash, true)

    docs.forEach((doc) => {
      Vue.set(state[hash], doc.id, doc.data())
    })

    Vue.set(state, loadingHash, false)
  }

  function getById(id) {
    if (!state[hash]) {
      return false
    }

    return state[hash][id]
  }

  const loading = computed(() => {
    return state[loadingHash]
  })

  const docs = computed(() => {
    if (!state[hash]) {
      return []
    }

    return Object.keys(state[hash]).map((key) => ({
      ...state[hash][key],
      id: key
    }))
  })

  return {
    ...toRefs(state),
    getById,
    docs,
    loading,
    load
  }
}
