<template>
  <script
    async
    src="https://telegram.org/js/telegram-widget.js?11"
    :data-telegram-post="url"
    data-width="100%"
  ></script>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
}
</script>
