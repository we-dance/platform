<template>
  <div class="p-4 bg-light rounded shadow">
    <div v-if="image" class="flex justify-center ">
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
      <div v-if="button" class="flex gap-4">
        <TButton
          allow-guests
          :to="url"
          :track="{ event: 'cta_primary', action: buttonAction }"
          type="primary"
          class="no-underline"
          >{{ button }}</TButton
        >
        <TButton
          v-if="alternative"
          allow-guests
          :track="{ event: 'cta_secondary', action: alternativeAction }"
          :href="alternativeUrl"
          type="secondary"
        >
          {{ alternative }}
        </TButton>
      </div>
    </div>
    <div v-if="bottom" class="mt-4 text-xs text-center">
      {{ bottom }}
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
    button: {
      type: String,
      default: '',
    },
    buttonAction: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    bottom: {
      type: String,
      default: '',
    },
    alternative: {
      type: String,
      default: '',
    },
    alternativeAction: {
      type: String,
      default: '',
    },
    alternativeUrl: {
      type: String,
      default: '',
    },
  },
}
</script>
