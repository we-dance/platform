<template>
  <pre>{{ vars }}</pre>
</template>

<script>
const vars = {
  varA: process.env.varA,
  varB: process.env.varB,
  varC: process.env.varC,
  varD: process.env.varD
}

export default {
  computed: {
    vars() {
      return vars
    }
  }
}
</script>
