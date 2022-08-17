<template>
  <div>
    <TInputEvent v-model="event1" />
    <TInputEvent v-model="event2" />
  </div>
</template>

<script>
export default {
  data: () => ({
    event1: {
      name: 'Salsa Party',
    },
    event2: {},
  }),
}
</script>
