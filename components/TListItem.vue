<template>
  <div class="p-4">
    <dl v-for="field in fields" :key="field.value" class="flex space-x-2">
      <dt class="font-bold w-1/3 text-right">{{ field.label }}</dt>
      <dd>{{ item[field.value] }}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'TListItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    fields: {
      type: Array,
      default: () => ['id'],
    },
  },
}
</script>
