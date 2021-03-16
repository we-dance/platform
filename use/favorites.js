import firebase from 'firebase/app'
import 'firebase/firestore'
import { computed } from '@nuxtjs/composition-api'
import useDoc from '~/use/doc'

export default (uid, collection, item) => {
  const { update } = useDoc(collection)

  const isFavorite = computed(
    () => uid && item.favorites && item.favorites[uid]
  )

  const countFavorites = computed(() =>
    item.favorites ? Object.keys(item.favorites).length : 0
  )

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
