<template>
  <div>
    <button
      class="p-2"
      :class="{ 'is-active': value }"
      type="button"
      aria-label="Menu"
      aria-controls="navigation"
      @click="$emit('input', !value)"
    >
      <TIcon name="menu" class="h-8 w-8" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
