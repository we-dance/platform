<template>
  <div v-if="isEditing">
    <TForm v-model="value.name" :fields="schema" />
    <TInputDateTime v-model="value.startDate" />
    <TButton allow-guests @click="isEditing = false">Save</TButton>
  </div>
  <div v-else-if="!value.name">
    <TButton allow-guests @click="isEditing = true">Add Event</TButton>
  </div>
  <div v-else>
    <pre>{{ value.name }}</pre>
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
  data: () => ({ isEditing: false }),
}
</script>
