<template>
  <div v-if="isEditing">
    <TInput v-model="value.name" />
    <TButton @click="isEditing = false" allow-guests>Save</TButton>
  </div>
  <div v-else-if="!value.name">
    <TButton @click="isEditing = true" allow-guests>Add Event</TButton>
  </div>
  <div v-else>
    <pre>{{ value.name }}</pre>
  </div>
</template>

<script>
export default {
  data: () => ({ isEditing: false }),
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
