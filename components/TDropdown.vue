<template>
  <TMenu>
    <template v-slot:button>
      <TButton :icon="icon" :type="type" :label="label" :title="title" />
    </template>
    <template v-slot:menu="{ closeMenu }">
      <div class="w-32 rounded-lg border bg-white py-2 shadow-xl">
        <slot :closeMenu="closeMenu" />
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
    title: {
      type: String,
      default: 'open dropdown',
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
