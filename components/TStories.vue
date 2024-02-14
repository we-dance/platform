<template>
  <div>
    <TLoader v-if="loading" />
    <div v-else-if="stories.length">
      <div v-for="item in stories" :key="item.id">
        <TPost :item="item" />
      </div>
      <div class="mt-4 p-4 flex justify-center items-center">
        <TButton @click="loadMore">{{ $t('TPostList.loadMore') }}</TButton>
      </div>
    </div>
    <div v-else>
      <div class="text-xs text-center p-4">There are no stories yet.</div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref } from '@nuxtjs/composition-api'

export default {
  name: 'TStories',
  props: {
    createdBy: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      default: '',
    },
    dance: {
      type: String,
      default: '',
    },
    filterDance: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const loading = ref(true)
    const stories = ref([])

    function loadMore() {
      console.log('loadMore')
    }

    onMounted(() => {
      const firestore = firebase.firestore()
      let collection = firestore.collection('stories')

      if (props.dance) {
        collection = collection.where('dances', 'array-contains', props.dance)
      }

      if (props.createdBy) {
        collection = collection.where('createdBy', '==', props.createdBy)
      }

      if (props.place) {
        collection = collection.where('place', '==', props.place)
      }

      collection.orderBy('createdAt', 'desc').onSnapshot((storiesRef) => {
        let result = storiesRef.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))

        if (props.filterDance) {
          result = result.filter((item) => item.style === props.filterDance)
        }

        stories.value = result

        loading.value = false
      })

      loading.value = false
    })

    return {
      stories,
      loadMore,
      loading,
    }
  },
}
</script>
