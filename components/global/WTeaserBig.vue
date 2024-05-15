<template>
  <div class="text-center p-4 w-full">
    <slot name="preheader" />
    <h1 v-if="header" class="text-2xl font-bold">{{ header }}</h1>
    <p v-if="description" class="text-sm">
      {{ description }}
    </p>
    <slot name="subheader" />
    <div v-if="button" class="flex flex-col justify-center items-center">
      <TButton
        v-if="button"
        :allow-guests="allowGuests"
        :title="button"
        class="my-2 no-underline px-32 py-2"
        type="primary"
        :to="url"
        :href="href"
        v-on="$listeners"
        >{{ button }}</TButton
      >
      <div v-if="buttonAfter" class="text-xs">
        {{ buttonAfter }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    allowGuests: {
      type: Boolean,
      default: true,
    },
    header: {
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
    buttonAfter: {
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
