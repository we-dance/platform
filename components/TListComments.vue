<template>
  <TCardList
    :collection="collection"
    :fields="fields"
    :map="map"
    :filters="filters"
  >
    <template v-slot:empty>
      <slot name="empty" />
    </template>

    <template v-slot:default="{ item }">
      <TCardComment :post-id="postId" :item="item" />
    </template>
  </TCardList>
</template>

<script>
import { useReactions } from '~/use/reactions'

export default {
  name: 'TListComments',
  props: {
    postId: {
      type: String,
      default: '',
    },
    commentId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const items = []

    const collection = 'comments'

    const fields = [
      {
        name: 'body',
        component: 'TInputMarkdown',
        hideLabel: true,
      },
    ]

    const filters = [
      {
        name: 'all',
        default: true,
        filter: (item) =>
          item.postId === props.postId && item.commentId === props.commentId,
        sort: 'createdAt',
      },
    ]

    const { map } = useReactions()

    return {
      items,
      collection,
      fields,
      filters,
      map,
    }
  },
}
</script>
