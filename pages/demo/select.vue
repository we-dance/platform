<template>
  <div class="space-y-2">
    <t-rich-select
      v-for="(items, item) in options"
      :key="item"
      v-model="filters[item]"
      :placeholder="`${item} select`"
      :options="items"
      clearable
      hide-search-box
    />
    <TButton @click="filters = {}">Clear</TButton>
  </div>
</template>

<script>
export default {
  data: () => ({
    filters: {},
    options: {
      first: [
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
      second: [
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
    },
  }),
}
</script>
