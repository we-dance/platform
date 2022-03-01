<template>
  <div class="block h-screen w-full">
    <input ref="place" v-model="value" class="h-5 w-1/2 bg-gray-200" />
    <button class="bg-blue-500" @click="save">{{ title }}</button>
    <pre>{{ result }}</pre>
  </div>
</template>

<script>
import { getVenueFromText } from '~/utils'

export default {
  data: () => ({
    value: '',
    result: null,
    title: 'Save',
  }),
  methods: {
    async save() {
      const res = await getVenueFromText(this.value)
      this.result = JSON.stringify(res, null, 2)
    },
  },
}
</script>
