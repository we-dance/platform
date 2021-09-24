<template>
  <div class="rounded bg-dark-gradient text-white text-sm text-center p-4">
    <div>
      <h1 class="font-bold text-lg">{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div class="flex justify-center">
      <TButton
        v-if="button"
        class="my-2"
        type="primary"
        :to="url"
        :href="href"
        v-on="$listeners"
        >{{ button }}</TButton
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    button: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '',
    },
  },
}
</script>
