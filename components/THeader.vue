<template>
  <header class="border-b p-4">
    <div class="flex items-center justify-between">
      <div class="flex flex-no-wrap items-center">
        <div class="mt-1 md:hidden">
          <THamburger v-model="isMenuOpen" />
        </div>
        <h1 class="ml-1 font-lato text-lg font-bold">
          {{ title }}
        </h1>
      </div>
      <div class="flex-grow"></div>
      <TButton type="nav" icon="search" to="/search" />
    </div>
  </header>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isMenuOpen: false
  })
}
</script>
