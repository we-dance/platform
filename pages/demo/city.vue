<template>
  <div class="my-4 space-y-4 p-4">
    <div>
      <h2 class="mb-2 font-bold">TInputPlace</h2>
      <TInputPlace v-model="data.TInputPlace" clearable />
    </div>

    <div>
      <h2 class="mb-2 font-bold">TInputCity</h2>
      <TInputCity v-model="data.TInputCity" />
    </div>

    <div>
      <h2 class="mb-2 font-bold">TInputLocation</h2>
      <TInputLocation v-model="data.TInputLocation" />
    </div>

    <div>
      <h2 class="mb-2 font-bold">TInputAddress</h2>
      <TInputAddress v-model="data.TInputAddress" />
    </div>

    <div>
      <h2 class="mb-2 font-bold">TInputVenue</h2>
      <TInputVenue v-model="data.TInputVenue" />
    </div>

    <div>
      <h2 class="mb-2 font-bold">TField/Collection/Venues</h2>
      <TField
        v-model="data.TField"
        component="TInputCollection"
        collection="venues"
        key-value="id"
        key-label="name"
        can-add
      />
    </div>

    <div>
      <h2 class="mb-2 font-bold">Data:</h2>
      <textarea
        class="w-full bg-gray-100 p-4 font-mono"
        rows="30"
        :value="result"
      />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    data: {},
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
