<template>
  <div>
    <TTabs v-model="variant" :tabs="variants" />
    <div class="bordered p-4">
      <TInputStylesSelect v-if="variant === 'v1'" v-model="selected" />
      <TInputStylesSelect2 v-if="variant === 'v2'" v-model="selected" />
    </div>
    <div v-if="$route.query.debug" class="p-4 bg-gray-200 rounded mt-4 w-full">
      <pre>{{ selected }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageDance',
  data: () => ({
    variant: '',
    variants: [
      {
        value: 'v1',
        label: 'Variant 1',
      },
      {
        value: 'v2',
        label: 'Variant 2',
      },
    ],
    selected: {},
  }),
}
</script>
