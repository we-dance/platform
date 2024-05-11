<template>
  <div class="space-y-4 my-4 p-4">
    <div>
      <TInputPlace v-model="data" />
    </div>
    <pre>{{ result }}</pre>
  </div>
</template>

<script>
export default {
  data: () => ({
    data: 'ChIJ2V-Mo_l1nkcRfZixfUq4DAE',
  }),
  computed: {
    result() {
      return JSON.stringify(this.data, null, 2)
    },
  },
  watch: {
    data: {
      deep: true,
      handler: (newVal) => {
        console.log(newVal)
      },
    },
  },
}
</script>
