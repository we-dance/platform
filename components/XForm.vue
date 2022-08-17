<template>
  <div>
    <TField
      v-for="field in fields"
      :key="field.name"
      v-model="value[field.name]"
      :label="field.name"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    fields: {
      type: Array,
      required: true,
    },
  },
}
</script>
