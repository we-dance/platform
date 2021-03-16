<template>
  <TButtonLike
    :value="isFavorite"
    :count="countFavorites"
    @change="setFavorite(!isFavorite)"
  />
</template>

<script>
import useAuth from '~/use/auth'
import useFavorites from '~/use/favorites'

export default {
  props: {
    collection: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const { uid } = useAuth()
    const { setFavorite, isFavorite, countFavorites } = useFavorites(
      uid.value,
      props.collection,
      props.item
    )

    return {
      setFavorite,
      isFavorite,
      countFavorites
    }
  }
}
</script>
