<template>
  <router-link
    class="underline hover:no-underline"
    :to="localePath(`/dance/${dance}`)"
    >{{ getStyleName(dance) }}</router-link
  >
</template>

<script>
import { useStyles } from '~/use/styles'

export default {
  props: {
    dance: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { getStyleName } = useStyles()

    return {
      getStyleName,
    }
  },
}
</script>
