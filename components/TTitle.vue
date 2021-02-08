<template>
  <div class="md:flex items-center leading-none justify-between mb-4">
    <h1 class="text-md font-bold mb-4 md:mb-0">
      <slot />
    </h1>
    <slot name="right" />
  </div>
</template>
