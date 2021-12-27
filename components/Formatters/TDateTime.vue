<template>
  <time :datetime="value">{{ getDateTime(value) }}</time>
</template>

<script>
import { getDateTime } from '~/utils'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    getDateTime,
  },
}
</script>
