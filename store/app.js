import firebase from 'firebase/app'
import 'firebase/firestore'

export const state = () => ({
  cache: {}
})

export const mutations = {
  set(state, cache) {
    state.cache = cache
  }
}

export const actions = {
  async init({ commit }) {
    console.log('store: app/init')

    const firestore = firebase.firestore()

    const doc = await firestore
      .collection('app')
      .doc('latest')
      .get()

    const data = doc.data()

    commit('set', data)
  }
}

export const getters = {
  get: (state) => (collection, id, field) => {
    if (
      !state.cache ||
      !collection ||
      !id ||
      !state.cache[collection] ||
      !state.cache[collection][id]
    ) {
      return ''
    }

    if (!field) {
      return state.cache[collection][id]
    }

    return state.cache[collection][id][field]
  }
}
