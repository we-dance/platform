<template>
  <div>
    <div class="p-4">
      <TField component="TCheckbox" :value.sync="data" @input="onInput" />
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    data: '',
  }),
  methods: {
    onInput(val) {
      this.data = val
    },
  },
}
</script>
