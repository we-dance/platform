<template>
  <div class="md:flex items-baseline justify-between mb-4">
    <h1 class="text-4xl font-bold">
      <slot />
    </h1>
    <slot name="right" />
  </div>
</template>
