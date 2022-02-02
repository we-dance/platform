<template>
  <div class="space-y-4 my-4 p-4">
    <div>
      <h2 class="font-bold mb-2">TInputPlace</h2>
      <TInputPlace v-model="data.TInputPlace" clearable />
    </div>

    <div>
      <h2 class="font-bold mb-2">TInputCity</h2>
      <TInputCity v-model="data.TInputCity" />
    </div>

    <div>
      <h2 class="font-bold mb-2">TInputLocation</h2>
      <TInputLocation v-model="data.TInputLocation" />
    </div>

    <div>
      <h2 class="font-bold mb-2">TInputAddress</h2>
      <TInputAddress v-model="data.TInputAddress" />
    </div>

    <div>
      <h2 class="font-bold mb-2">TInputVenue</h2>
      <TInputVenue v-model="data.TInputVenue" />
    </div>

    <div>
      <h2 class="font-bold mb-2">TField/Collection/Venues</h2>
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
      <h2 class="font-bold mb-2">Data:</h2>
      <textarea
        class="p-4 bg-gray-100 font-mono w-full"
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
