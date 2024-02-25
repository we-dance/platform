<template>
  <div>
    <TLoader v-if="loading" />
    <div v-else-if="stories.length">
      <div v-for="item in stories" :key="item.id">
        <TPost :item="item" />
      </div>
      <div class="mt-4 p-4 flex justify-center items-center">
        <TButton @click="load">{{ $t('TPostList.loadMore') }}</TButton>
      </div>
    </div>
    <div v-else>
      <div class="text-xs text-center p-4">
        There are no recommendations yet.
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'

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
    city: {
      type: Object,
      default: () => ({}),
    },
    dance: {
      type: String,
      default: '',
    },
    filterDance: {
      type: String,
      default: '',
    },
    noPlace: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root }) {
    const loading = ref(true)
    const stories = ref([])
    const lastVisible = ref(null)
    const radius = ref(root.$route.query.radius || 50)
    const { search } = useAlgolia('profiles')

    async function load() {
      const firestore = firebase.firestore()
      let collection = firestore.collection('stories')

      if (props.dance) {
        collection = collection.where('dances', 'array-contains', props.dance)
      }

      if (props.createdBy) {
        collection = collection.where('createdBy', '==', props.createdBy)
      }

      if (props.place) {
        const response = await search('', {
          filters: 'type:City',
          page: 0,
          aroundLatLng: radius.value
            ? `${props.city.location.latitude}, ${props.city.location.longitude}`
            : '',
          aroundRadius: radius.value * 1000 || 1,
          hitsPerPage: 9,
        })

        const places = response.hits.map((item) => item.place)
        places.push(props.place)

        collection = collection.where('place', 'in', places)
      }

      if (props.noPlace) {
        collection = collection.where('place', '==', '')
      }

      if (lastVisible.value) {
        collection = collection.startAfter(lastVisible.value)
      }

      collection
        .orderBy('createdAt', 'desc')
        .limit(3)
        .onSnapshot((storiesRef) => {
          let result = storiesRef.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))

          if (props.filterDance) {
            result = result.filter((item) => item.style === props.filterDance)
          }

          stories.value = [...stories.value, ...result]

          loading.value = false

          lastVisible.value = storiesRef.docs[storiesRef.docs.length - 1]
        })

      loading.value = false
    }

    onMounted(load)

    return {
      stories,
      load,
      loading,
    }
  },
}
</script>
