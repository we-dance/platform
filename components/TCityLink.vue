<template>
  <a
    v-if="!city"
    target="_blank"
    :href="`https://www.google.com/maps/place/?q=place_id:${place}`"
    class="underline hover:no-underline"
    >{{ place }}</a
  >
  <router-link
    v-else
    class="underline hover:no-underline"
    :to="localePath(`/explore/${city.username}`)"
    >{{ city.name }}</router-link
  >
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref } from '@nuxtjs/composition-api'

export default {
  props: {
    place: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const city = ref('')

    onMounted(() => {
      if (!props.place) {
        return
      }

      const db = firebase.firestore()
      db.collection('profiles')
        .where('cityPlaceId', '==', props.place)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            city.value = doc.data()
          })
        })
    })

    return { city }
  },
}
</script>
