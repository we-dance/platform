<template>
  <pre>{{ vars }}</pre>
</template>

<script>
const vars = {
  VAR_A: process.env.VAR_A,
  VUE_APP_VAR_B: process.env.VUE_APP_VAR_B,
  VAR_C: process.env.VAR_C,
  VUE_APP_VAR_D: process.env.VUE_APP_VAR_D
}

export default {
  computed: {
    vars() {
      return vars
    }
  }
}
</script>
