import { reactive, toRefs, computed } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'
import stats from '~/stats'

export const useDoc = (name) => {
  const { uid, username } = useAuth()

  const firestore = firebase.firestore()

  const state = reactive({
    loading: false,
    saving: false,
    exists: false,
    doc: {},
    id: null,
    slug: null,
  })

  const collection = firestore.collection(name)

  function sync(id) {
    state.loading = true
    collection.doc(id).onSnapshot((doc) => {
      state.loading = false
      state.exists = doc.exists

      if (doc.exists) {
        state.doc = doc.data()
        state.id = doc.id
        state.doc.id = doc.id
      } else {
        state.doc = {}
        state.id = null
      }
    })
  }

  async function load(id) {
    stats.add(name, 1, 'doc.load')

    state.loading = true
    let doc = {}

    if (id) {
      doc = await collection.doc(id).get()
    }

    state.id = id

    if (!doc.exists) {
      state.exists = false
      state.loading = false
      state.doc = {}
      state.id = null

      return false
    }

    state.doc = doc.data()
    state.doc.id = id

    state.exists = true
    state.loading = false

    return true
  }

  async function find(param, value) {
    state.loading = true

    if (!value) {
      return
    }

    const filteredCollection = await collection.where(param, '==', value).get()

    if (filteredCollection.docs.length === 0) {
      state.exists = false
      state.loading = false
      state.doc = {}
      state.id = null

      return false
    }

    const doc = filteredCollection.docs[0]

    state.doc = doc.data()

    state.id = doc.id

    state.exists = true
    state.loading = false

    return state.doc
  }

  async function softUpdate(id, data) {
    state.saving = true

    const result = await collection.doc(id).update(data)
    state.doc = { ...state.doc, ...data }

    state.saving = false

    return result
  }

  async function update(id, data) {
    state.saving = true

    const changes = {
      updatedAt: +new Date(),
      updatedBy: uid.value,
      ...data,
    }

    const result = await collection.doc(id).update(changes)

    state.saving = false
    state.doc = { ...state.doc, ...data }

    return result
  }

  async function set(id, data) {
    state.saving = true

    const result = await collection.doc(id).set({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      updatedBy: uid.value,
      username: username.value,
      ...data,
    })

    state.saving = false

    return result
  }

  async function remove(id) {
    state.saving = true

    const result = await collection.doc(id).delete()

    state.id = null
    state.saving = false

    return result
  }

  async function create(data) {
    state.saving = true

    const docData = {
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      updatedBy: uid.value,
      username: username?.value || '',
      ...data,
    }

    const doc = await collection.add(docData)

    docData.id = doc.id
    state.id = doc.id
    state.saving = false
    state.doc = docData

    return doc
  }

  const isCreator = computed(
    () => state.doc && uid.value === state.doc.createdBy
  )

  return {
    ...toRefs(state),
    create,
    find,
    update,
    softUpdate,
    load,
    remove,
    isCreator,
    set,
    sync,
  }
}
