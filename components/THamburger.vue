<template>
  <div>
    <button
      class="hamburger hamburger--elastic appearance-none outline-none focus:outline-none"
      :class="{ 'is-active': value }"
      type="button"
      aria-label="Menu"
      aria-controls="navigation"
      @click="$emit('input', !value)"
    >
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
