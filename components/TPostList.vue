<template>
  <div>
    <TLoader v-if="!loaded" />
    <div
      v-else-if="!count && showEmpty"
      class="p-4 text-center text-xs text-gray-700"
    >
      {{ emptyLabel }}
    </div>
    <h2 v-if="title" class="font-bold text-lg mb-4">{{ title }}</h2>
    <div v-if="docs.length">
      <div v-for="item in docs" :key="item.id">
        <TPost :item="item" :hide-media="hideMedia" />
      </div>
      <div class="mt-4 p-4 flex justify-center items-center">
        <TButton @click="loadMore">{{ $t('TPostList.loadMore') }}</TButton>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { onUnmounted, watch } from '@nuxtjs/composition-api'
import { useDocs } from '~/use/docs'

export default {
  name: 'TPostList',
  props: {
    filter: {
      type: Object,
      default: null,
    },
    sorting: {
      type: String,
      default: '-createdAt',
    },
    orderBy: {
      type: String,
      default: '',
    },
    orderByDirection: {
      type: String,
      default: 'desc',
    },
    title: {
      type: String,
      default: '',
    },
    emptyLabel: {
      type: String,
      default: 'No posts',
    },
    showEmpty: {
      type: Boolean,
      default: true,
    },
    hideMedia: {
      type: Boolean,
      default: false,
    },
    hideComments: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const db = firebase.firestore()

    const getCollection = () => {
      const filter = props.filter

      let collection = db.collection('posts')
      let field = ''
      let value = ''

      if (filter) {
        field = Object.keys(filter)[0]
        value = filter[field]
      }

      if (field) {
        collection = collection.where(field, '==', value)
      }

      if (props.orderBy) {
        collection = collection.orderBy(props.orderBy, props.orderByDirection)
      }

      collection = collection.limit(10)

      return collection
    }

    const { docs, count, loaded, loadMore, load, detachListeners } = useDocs(
      getCollection()
    )

    watch(
      () => props,
      () => {
        load(getCollection())
      },
      { deep: true }
    )

    onUnmounted(detachListeners)

    return {
      docs,
      loaded,
      count,
      loadMore,
      load,
    }
  },
}
</script>
