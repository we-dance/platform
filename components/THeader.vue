<template>
  <header class="border-b">
    <div class="flex items-center justify-between">
      <div class="flex flex-no-wrap items-center ml-12 my-3 md:ml-0">
        <router-link v-if="showLogo" to="/" :class="logoClass">
          <TIcon name="logo-horizontal-dark" />
        </router-link>
        <h1 v-if="title" class="ml-1 font-lato text-lg font-bold">
          {{ title }}
        </h1>
      </div>
      <slot name="left" />
      <div class="flex-grow"></div>
      <slot />
      <TQrCodeButton />
    </div>
  </header>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    showLogo: {
      type: Boolean,
      default: false,
    },
    logoClass: {
      type: String,
      default: 'md:hidden',
    },
  },
}
</script>
