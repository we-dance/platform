<template>
  <TMenu>
    <template v-slot:button>
      <TButton
        allow-guests
        :icon="icon"
        :type="type"
        :label="label"
        :title="title"
      />
    </template>
    <template v-slot:menu="{ closeMenu }">
      <div class="w-32 py-2 bg-white rounded-lg shadow-xl border">
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
