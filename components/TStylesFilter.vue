<template>
  <TInputSelect
    :value="value"
    :options="dancesList"
    @change="(val) => $emit('change', val)"
  />
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import useStyles from '~/use/styles'
import { getOptions } from '~/utils'

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
    const { getAllStyles, getStyles } = useStyles()

    const dancesList = computed(() => {
      const list =
        Object.keys(props.selected).length > 0
          ? getStyles(props.selected).map((item) => ({
              value: item.id,
              label: item.name
            }))
          : getAllStyles()

      return getOptions(list, 'Style')
    })

    return {
      dancesList
    }
  }
}
</script>
