<template>
  <div class="grid h-screen w-screen content-center justify-center bg-gray-300">
    <h2 class="mb-4">{{ formattedDate }}</h2>
    <input
      type="text"
      placeholder="enter the date"
      v-model="date"
      class="mb-4"
    />
    <button
      @click="getDateFromText(date)"
      class="w-64 cursor-pointer rounded bg-red-400 py-3 px-4 text-xl text-white"
    >
      Submit
    </button>
  </div>
</template>

<script>
import { isValid, format, parseISO } from 'date-fns'
export default {
  name: 'App',
  data() {
    return {
      date: '',
      formattedDate: '',
    }
  },
  methods: {
    getDateFromText(input) {
      const [day, month, year] = input.split('.')
      const yearCheck = `${
        year == undefined ? new Date().getFullYear() : year
      }-${month}-${day}`
      if (isValid(parseISO(yearCheck))) {
        return (this.formattedDate = yearCheck)
      } else {
        return (this.formattedDate = format(
          new Date(yearCheck),
          'yyyy-MM-dd',
          new Date()
        ))
      }
    },
  },
}
</script>
