<template>
  <div class="flex h-6 items-center leading-none justify-between mb-4">
    <h1 class="text-md font-bold">
      <slot />
    </h1>
    <slot name="right" />
  </div>
</template>
