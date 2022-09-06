<template>
    <div v-if="!value.name">
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
        type: Object,
        default: () => ({}),
      },
      placeholder: {
        type: String,
        default: 'placeholder'
      },
    },
  }
  </script>