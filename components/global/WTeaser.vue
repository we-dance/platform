<template>
  <div class="border bg-gray-100 text-sm text-center p-4 my-4">
    <div>
      <h4 class="font-bold text-xl my-0">{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    <div class="flex justify-center">
      <TButton
        allow-guests
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
