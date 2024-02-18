<template>
  <div class="p-4 bg-light rounded shadow">
    <div class="flex justify-center ">
      <div
        class="flex items-center justify-center w-20 h-20 bg-white rounded-full"
      >
        <img :src="image" :alt="title" />
      </div>
    </div>
    <h3 class="text-2xl font-extrabold text-center">
      {{ title }}
    </h3>
    <div class="flex flex-col items-center gap-4">
      <div class="text-center">
        {{ description }}
      </div>
      <div>
        <TButton :to="ctaLink" type="primary">{{ ctaLabel }}</TButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
    ctaLink: {
      type: String,
      default: '',
    },
  },
}
</script>
