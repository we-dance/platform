<template>
  <TForm v-model="data" :fields="fields" />
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

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

    return { data, fields }
  },
}
</script>
