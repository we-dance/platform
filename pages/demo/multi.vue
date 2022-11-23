<template>
  <div class="space-y-2">
    <TMultiObjects v-model="value" :options="options" field="value" />
    <pre>{{ value }}</pre>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: [
      {
        label: 'Option 1',
        value: 'option1',
      },
      {
        label: 'Option 2',
        value: 'option2',
      },
    ],
    options: [
      {
        label: 'Option 1',
        value: 'option1',
      },
      {
        label: 'Option 2',
        value: 'option2',
      },
      {
        label: 'Option 3',
        value: 'option3',
      },
    ],
  }),
}
</script>
