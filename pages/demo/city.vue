<template>
  <div class="space-y-4 my-4 p-4">
    <div>
      <TInputVenue v-model="data" clearable />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    data: '',
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
