<template>
  <div>
    <div class="bg-gray-200 p-2">
      <TInput
        v-model="query"
        auto-focus
        placeholder="Search WeDance"
        class="rounded-full"
        @input="search"
      />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    query: ''
  }),
  methods: {
    search() {}
  }
}
</script>
