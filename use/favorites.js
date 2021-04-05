import firebase from 'firebase/app'
import 'firebase/firestore'
import { computed } from '@nuxtjs/composition-api'
import { useDoc } from '~/use/doc'

export const getCountFavorites = (item) =>
  item.savedBy ? Object.keys(item.savedBy).length : 0

export const getIsFavorite = (uid, item) =>
  uid && item.savedBy && item.savedBy[uid]

export const useFavorites = (uid, collection, item) => {
  const { update } = useDoc(collection)

  const isFavorite = computed(() => getIsFavorite(uid, item))

  const countFavorites = computed(() => getCountFavorites(item))

  const setFavorite = (val) => {
    const id = item.id

    if (!id) {
      return
    }

    let change = {}

    if (val) {
      change = {
        [`savedBy.${uid}`]: true
      }
    } else {
      change = {
        [`savedBy.${uid}`]: firebase.firestore.FieldValue.delete()
      }
    }

    update(id, change)
  }

  return {
    isFavorite,
    setFavorite,
    countFavorites
  }
}
