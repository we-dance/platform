<template>
  <div class="flex gap-4">
    <a
      v-for="ad in ads"
      :key="ad.id"
      :href="ad.url"
      target="_blank"
      class="bg-gray-50 flex flex-col w-32 border rounded shadow overflow-hidden"
      @click="capture(ad)"
    >
      <img :src="ad.image" :alt="ad.name" class="h-32 w-32 bg-white border-b" />
      <div class="px-2 py-1">
        <span class="rounded bg-primary text-white text-xs px-1">{{
          ad.discount
        }}</span>
        <div class="text-xs">{{ ad.description }}</div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    track: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    ads: [
      {
        id: 1,
        name: 'Fuego Dance',
        image: '/img/fuego.webp',
        url: 'https://bit.ly/4a6LRZQ',
        discount: '10%',
        description: "Fuego – world's best dance sneakers",
      },
      {
        id: 2,
        name: 'Dancing Queens',
        image: '/img/dancingqueens.png',
        url: 'https://bit.ly/4aqYTRO',
        discount: '€10',
        description:
          'Top dance shoes and fitness wear from Höhle der Löwen Schweiz',
      },
    ],
  }),
  methods: {
    capture(ad) {
      if (!this.track) return

      this.$track(this.track, ad)
    },
  },
}
</script>
