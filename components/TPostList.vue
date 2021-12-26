<template>
  <div>
    <TLoader v-if="loading" />
    <div v-else-if="!count && showEmpty">
      {{ emptyLabel }}
    </div>
    <h2 v-if="title" class="font-bold text-lg mb-4">{{ title }}</h2>
    <div class="p-4 border-b">
      <TButton @click="run">Run</TButton>
    </div>
    <div v-if="items.length">
      <TPost v-for="item in items" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { useCollection } from '~/use/collection'
import { sortBy } from '~/utils'
import { useApp } from '~/use/app'
import { useDoc } from '~/use/doc'
import { useProfiles } from '~/use/profiles'

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
    title: {
      type: String,
      default: '',
    },
    emptyLabel: {
      type: String,
      default: 'No post found',
    },
    showEmpty: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    run() {},
  },
  setup(params) {
    const { docs, loading } = useCollection('posts', params.filter)
    const { set: setPost, update: updatePost } = useDoc('posts')

    const count = computed(() => items.value.length)
    const isPublic = (item) => item.visibility !== 'Unlisted'

    const items = computed(() => {
      const result = docs.value.filter(isPublic)

      return result.sort(sortBy(params.sorting))
    })

    return {
      count,
      items,
      loading,
      setPost,
      updatePost,
    }
  },
}
</script>
