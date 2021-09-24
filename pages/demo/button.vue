<template>
  <div>
    <div class="flex space-x-2">
      <TInputSelect v-model="icon" :options="icons" />
      <TInputSelect v-model="type" :options="types" />
      <TInput v-model="label" />
    </div>
    <div class="mt-4">
      <TButton :icon="icon" :type="type" :label="label" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    icon: '',
    type: '',
    label: 'Button',
  }),
  computed: {
    icons() {
      return ['', 'share']
    },
    types() {
      return [
        'round',
        'icon',
        'simple',
        'primary',
        'success',
        'danger',
        'base',
        'secondary',
        'link',
        'context',
        'nav',
      ]
    },
  },
}
</script>
