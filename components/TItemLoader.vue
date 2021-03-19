<template>
  <TItemViewer :collection="collection" :item.sync="doc" />
</template>

<script>
import useDoc from '~/use/doc'

export default {
  props: {
    collection: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { doc, load } = useDoc(props.collection)
    load(props.id)

    return { doc }
  }
}
</script>
