<template>
  <div v-if="isEditing">
    <TForm v-model="value.name" :fields="schema" />
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
  data: () => ({
    eventEditor: {
      name: '',
      starts: '',
    },
    isEditing: false,
    schema: [
      {
        name: 'subEventName',
        label: 'Name your sub-event',
      },
      {
        name: 'subEventStart',
        label: 'Sub-event start time',
      },
      {
        name: 'subEventEnd',
        label: 'Sub-event end time',
      },
      {
        name: 'subEventDescription',
        label: 'Sub-event description',
      },
    ],
  }),
}
</script>
