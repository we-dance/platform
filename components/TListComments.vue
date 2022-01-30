<template>
  <TCardList :collection="collection" :fields="fields" :filters="filters">
    <template v-slot:empty>
      <slot name="empty" />
    </template>

    <template v-slot:default="{ item }">
      <TCardComment :post-id="postId" :item="item" class="py-2" />
    </template>
  </TCardList>
</template>

<script>
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

    return {
      collection,
      fields,
      filters,
    }
  },
}
</script>
