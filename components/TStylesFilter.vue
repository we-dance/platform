<template>
  <TInputSelect
    :value="value"
    :options="dancesList"
    @input="(val) => $emit('input', val)"
  />
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import useStyles from '~/use/styles'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { getStylesDropdown } = useStyles()

    const dancesList = computed(() => {
      return getStylesDropdown(props.selected)
    })

    return {
      dancesList
    }
  }
}
</script>
