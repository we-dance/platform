<template>
  <codemirror
    :options="{
      mode: 'markdown',
      theme: 'base16-light',
      tabSize: 2,
      styleActiveLine: true,
      lineWrapping: true
    }"
    class="z-0"
    :value.sync="value"
    @input="(val) => $emit('input', val)"
  />
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/markdown/markdown.js'

export default {
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
