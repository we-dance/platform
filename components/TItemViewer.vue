<template>
  <TSharePreviewPost v-bind="preview" size="sm" />
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { getExcerpt } from '~/utils'

export default {
  name: 'TItemViewer',
  props: {
    collection: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const data = props.item

    const preview = computed(() => {
      const mapping = {
        profiles: {
          type: data.type,
          collection: props.collection,
          username: data.username,
          description: getExcerpt(data.bio),
          color: data.partner === 'Yes' ? 'bg-green-400' : 'bg-red-400',
          photo: data.photo,
          styles: data.styles
        }
      }

      return mapping[props.collection] || {}
    })

    return {
      preview
    }
  }
}
</script>
