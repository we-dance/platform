<template>
  <div>
    <div
      v-for="style in getStyles(value)"
      :key="style.id"
      class="inline-block rounded-full px-2 py-1 border m-1"
      :class="levelClass[style.level]"
    >
      {{ style.name }}
    </div>
  </div>
</template>

<script>
import useStyles from '~/use/styles'

export default {
  setup() {
    const { getStyles } = useStyles()

    return {
      getStyles
    }
  },
  props: {
    value: {
      type: [Object, String],
      default: () => ({})
    }
  },
  data: () => ({
    levelClass: {
      Interested: '',
      Beginner: 'text-green-500',
      Intermediate: 'text-orange-500',
      Advanced: 'text-red-500'
    }
  })
}
</script>
