<template>
  <div>
    <TLoader v-if="loading" />
    <div v-else-if="stories.length">
      <div v-for="item in stories" :key="item.id">
        <TPost :item="item" />
      </div>
    </div>
    <div v-else>
      <div class="text-xs text-center p-4">
        There are no posts yet.
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref } from '@nuxtjs/composition-api'

export default {
  name: 'PostsList',
  setup(props, { root }) {
    const loading = ref(true)
    const stories = ref([])

    onMounted(() => {
      const firestore = firebase.firestore()
      const collection = firestore.collection('posts')

      collection
        .where('type', '==', 'post')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .onSnapshot((storiesRef) => {
          const result = storiesRef.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))

          stories.value = result

          loading.value = false
        })

      loading.value = false
    })

    return {
      stories,
      loading,
    }
  },
}
</script>
