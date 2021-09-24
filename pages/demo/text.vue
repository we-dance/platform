<template>
  <div>
    <TInputTextarea v-model="text" />
  </div>
</template>

<script>
export default {
  data: () => ({
    text: '',
  }),
}
</script>
