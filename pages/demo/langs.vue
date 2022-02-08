<template>
  <div>
    <TTabs v-model="variant" :tabs="variants" />
    <div class="bordered p-4">
      <TInputLanguages v-if="variant === 'v1'" v-model="selected" />
    </div>
    <div v-if="$route.query.debug" class="mt-4 w-full rounded bg-gray-200 p-4">
      <pre>{{ selected }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLangs',
  data: () => ({
    variant: '',
    variants: [
      {
        value: 'v1',
        label: 'Variant 1',
      },
    ],
    selected: {},
  }),
}
</script>
