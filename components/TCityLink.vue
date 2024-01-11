<template>
  <span v-if="!city">{{ place }}</span>
  <router-link
    v-else
    class="underline hover:no-underline"
    :to="`/${city.username}`"
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
