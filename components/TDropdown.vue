<template>
  <TMenu>
    <template v-slot:button>
      <TButton :icon="icon" :type="type" :label="label" />
    </template>
    <template v-slot:menu>
      <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
        <slot />
      </div>
    </template>
  </TMenu>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'more_vert',
    },
    type: {
      type: String,
      default: 'nav',
    },
    label: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
}
</script>
