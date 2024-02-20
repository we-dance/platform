<template>
  <div class="h-[80vh] flex justify-center items-center">
    <div>
      <div class="relative sm:overflow-hidden">
        <div class="relative py-10 lg:p-14 px-4 md:px-8">
          <div class="text-center">
            <h1 class="font-bold text-2xl landing-hero-h1">
              <TPreview :content="header" no-typo />
            </h1>
            {{ subheader }}
          </div>

          <div class="max-w-lg mx-auto">
            <TButton
              allow-guests
              :label="ctaLabel"
              :to="ctaLink"
              type="void"
              class="mt-8 w-full text-gray-900 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-200 rounded-full shadow"
              ><TIcon name="place" class="w-4 h-4 text-primary"
            /></TButton>
          </div>

          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: '',
    },
    subheader: {
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

<style>
.landing-hero-h1 strong {
  @apply text-primary;
}
</style>
