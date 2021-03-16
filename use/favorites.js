import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { computed } from '@nuxtjs/composition-api'
import useDoc from '~/use/doc'

const changes = Vue.observable({})

export default (uid, collection, item) => {
  const { update } = useDoc(collection)

  const isFavorite = computed(
    () => uid && item.favorites && item.favorites[uid]
  )

  const addToFavorites = () => {
    const id = item.id

    if (!id) {
      return
    }

    let change = {}
    changes[item.id] = changes[item.id] || {}
    changes[item.id][uid] = !isFavorite.value

    if (!isFavorite.value) {
      change = {
        [`favorites.${uid}`]: true
      }
    } else {
      change = {
        [`favorites.${uid}`]: firebase.firestore.FieldValue.delete()
      }
    }

    update(id, change)
  }

  return {
    isFavorite,
    addToFavorites
  }
}
