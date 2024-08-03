<template>
  <div>
    <div class="p-4 border-b">
      <h1 class="text-2xl font-bold">
        Dance Keywords
      </h1>

      <div class="text-sm">
        Keywords used in import
      </div>
    </div>

    <div class="text-center">
      <div v-for="style in filteredStyles" :key="style.id" class="mb-4">
        <h4 class="font-bold text-lg">{{ style.name }}</h4>
        <div class="text-center">
          {{ style.regexp }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api'
import { useStyles } from '~/use/styles'

export default {
  name: 'DanceKeywords',
  setup() {
    const { styles } = useStyles()

    const filteredStyles = computed(() =>
      styles.value.filter((style) => style.regexp)
    )

    return {
      filteredStyles,
    }
  },
}
</script>
