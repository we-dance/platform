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

  if (!state[hash]) {
    const firestore = firebase.firestore()
    let collection = firestore.collection(name)

    Vue.set(state, hash, {})

    if (field) {
      collection = collection.where(field, '==', value)
    }

    Vue.set(state, loadingHash, true)

    collection.onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        Vue.set(state, loadingHash, false)
        if (change.type === 'modified' || change.type === 'added') {
          Vue.set(state[hash], change.doc.id, change.doc.data())
        }
        if (change.type === 'removed') {
          Vue.delete(state[hash], change.doc.id)
        }
      })
    })
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
    loading
  }
}
