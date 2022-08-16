<template>
  <div v-if="!value">
    <TButton>Add Event</TButton>
  </div>
  <div v-else>
    <div>Event Editor</div>
    <pre>{{ value }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default() {
        return this.$t('TInputProfile.placeholder')
      },
    },
  },
}
</script>
