<template>
  <time :datetime="getDateObect(value)">{{ getDateTime(value) }}</time>
</template>

<script>
import { getDateTime, getDateObect } from '~/utils'

export default {
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
  },
  methods: {
    getDateTime,
    getDateObect,
  },
}
</script>
