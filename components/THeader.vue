<template>
  <header class="border-b p-4">
    <div class="flex items-center justify-between">
      <div class="flex flex-no-wrap items-center ml-8 md:ml-0">
        <h1 class="ml-1 font-lato text-lg font-bold">
          {{ title }}
        </h1>
      </div>
      <slot name="left" />
      <div class="flex-grow"></div>
      <slot />
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
  },
}
</script>
