import { reactive, toRefs, computed } from '@vue/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import useAuth from '~/use/auth'

export default (name) => {
  const { uid } = useAuth()

  const firestore = firebase.firestore()

  const state = reactive({
    loading: false,
    saving: false,
    exists: false,
    doc: null,
    id: null,
    slug: null
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
      } else {
        state.doc = null
        state.id = null
      }
    })
  }

  async function load(id) {
    state.loading = true

    const doc = await collection.doc(id).get()
    state.id = id

    if (!doc.exists) {
      state.exists = false
      state.loading = false
      state.doc = {}

      return false
    }

    state.doc = doc.data()
    state.slug = state.doc.slug

    state.exists = true
    state.loading = false

    return true
  }

  async function find(param, value) {
    state.loading = true

    const filteredCollection = await collection.where(param, '==', value).get()

    if (filteredCollection.docs.length === 0) {
      state.exists = false
      state.loading = false
      state.doc = {}

      return false
    }

    const doc = filteredCollection.docs[0]

    state.doc = doc.data()
    state.id = doc.id

    state.exists = true
    state.loading = false

    return true
  }

  async function update(id, data) {
    state.saving = true

    const changes = {
      updatedAt: +new Date(),
      updatedBy: uid.value,
      ...data
    }

    const result = await collection.doc(id).update(changes)

    state.saving = false

    return result
  }

  async function set(id, data) {
    state.saving = true

    const result = await collection.doc(id).set(data)

    state.saving = false

    return result
  }

  async function remove(id) {
    state.saving = true

    const result = await collection.doc(id).delete()

    state.saving = false

    return result
  }

  async function create(data) {
    state.saving = true

    const doc = await collection.add({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: uid.value,
      updatedBy: uid.value,
      ...data
    })

    state.id = doc.id
    state.saving = false

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
    load,
    remove,
    isCreator,
    set,
    sync
  }
}
