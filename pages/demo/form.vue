<template>
  <TForm v-model="data" :fields="fields" />
</template>

<script>
import { ref } from '@nuxt/composition-api'

export default {
  setup() {
    const data = ref()
    const fields = [
      {
        name: 'title',
        component: 'TInput',
      },
      {
        name: 'description',
        component: 'TInputEditorjs',
      },
    ]

    return { fields }
  },
}
</script>
