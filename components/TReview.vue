<template>
  <div
    class="flex flex-col items-center p-2 gap-2 overflow-x-hidden shadow-md rounded-lg h-72"
  >
    <div class="flex flex-row items-center p-2 gap-4 w-full h-fit ">
      <TProfilePhoto2 size="lg" :src="item.author.photo" />
      <div class="flex flex-col items-start">
        <h3 class="font-semibold text-black-500">
          {{ item.author.username }}
        </h3>

        <div class="flex justify-left w-full h-fit items-center">
          <TRatingItem :rating="item.stars" />
          <a
            v-if="item.link"
            :href="item.link"
            class="text-gray-600 hover:text-gray-500"
          >
            {{ item.createdAt || 'Source' }}
          </a>
        </div>
      </div>
    </div>

    <div v-if="item.description" class="p-2 text-left w-full text-sm">
      {{ item.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TReview',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
