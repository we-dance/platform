<template>
  <div class="my-4 border bg-gray-100 p-4 text-center text-sm">
    <div>
      <h4 class="my-0 text-xl font-bold">{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    <div class="flex justify-center">
      <TButton
        v-if="button"
        allow-guests
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
