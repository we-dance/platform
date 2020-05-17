import Vue from 'vue'
import { computed, toRefs, watch } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

const state = Vue.observable({})

export default (name, filter) => {
  let field = ''
  let value = ''

  if (filter) {
    field = Object.keys(filter)[0]
    value = filter[field]
  }

  const hash = `${name}-${field}-${value}`

  const { uid } = useAuth()

  if (!state[hash]) {
    const firestore = firebase.firestore()
    let collection = firestore.collection(name)

    Vue.set(state, hash, {})

    watch(() => {
      if (!uid.value) {
        return
      }

      if (field) {
        collection = collection.where(field, '==', value)
      }

      collection.onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified' || change.type === 'added') {
            Vue.set(state[hash], change.doc.id, change.doc.data())
          }
          if (change.type === 'removed') {
            Vue.delete(state[hash], change.doc.id)
          }
        })
      })
    })
  }

  function getById(id) {
    if (!state[hash]) {
      return {}
    }

    return state[hash][id]
  }

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
    docs
  }
}
