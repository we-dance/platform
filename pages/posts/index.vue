<template>
  <div>
    <div class="p-4 border-b">
      <h1 class="text-2xl font-bold">
        {{ $t('explore.blog.header') }}
      </h1>

      <div class="text-sm">
        {{ $t('explore.blog.subheader') }}
      </div>
    </div>

    <div class="border-b p-4">
      <div class="flex flex-col gap-4 w-full">
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <TButton type="primary" label="Write a post" to="/posts/-/edit" />
        </div>
      </div>
    </div>

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
    const lastVisible = ref(null)

    function load() {
      const firestore = firebase.firestore()

      let collection = firestore.collection('posts')
      collection = collection
        .where('type', '==', 'post')
        .orderBy('createdAt', 'desc')
        .limit(3)

      if (lastVisible.value) {
        collection = collection.startAfter(lastVisible.value)
      }

      collection.onSnapshot((storiesRef) => {
        const result = storiesRef.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))

        stories.value = [...stories.value, ...result]

        loading.value = false
        lastVisible.value = storiesRef.docs[storiesRef.docs.length - 1]
      })

      loading.value = false
    }

    onMounted(load)

    return {
      stories,
      loading,
      load,
    }
  },
}
</script>
