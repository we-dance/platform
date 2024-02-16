<template>
  <div class="border rounded shadow hover:bg-gray-100">
    <a
      v-if="item"
      :href="url"
      target="_blank"
      class="flex space-x-2 items-center p-4"
    >
      <div v-if="item.image" class="w-12 h-12">
        <img :src="item.image" class="w-full h-full object-cover rounded" />
      </div>
      <div>
        <div class="font-bold">{{ item.title }}</div>
        <div class="text-gray-700 leading-tight text-sm mb-1">
          {{ item.description }}
        </div>
        <div class="text-indigo-500 text-xs">{{ shownUrl }}</div>
      </div>
    </a>
    <a
      v-else
      :href="url"
      target="_blank"
      class="block p-4 text-xs text-indigo-500"
      >{{ shownUrl }}</a
    >
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      item: null,
    }
  },
  computed: {
    shownUrl() {
      return this.url.replace(/(^\w+:|^)\/\//, '').replace(/\/.*/, '')
    },
  },
  mounted() {
    if (this.url.includes('facebook.com')) {
      return
    }

    fetch(
      `https://link-preview-api.nivaldo.workers.dev/preview?url=${this.url}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.item = data
      })
  },
}
</script>
