<template>
  <div>
    <dt
      class="flex w-full items-center justify-between text-left text-gray-900 cursor-pointer bg-gray-50 p-2"
      @click="toggle()"
    >
      <span class="text-sm font-semibold">{{ title }}</span>
      <span class="ml-6 flex items-center justify-center">
        <TIcon v-if="!open" name="plus" class="h-6 w-6" aria-hidden="true" />
        <TIcon v-else name="minus" class="h-6 w-6" aria-hidden="true" />
      </span>
    </dt>
    <dd v-show="open" class="mt-2 pb-2">
      <slot>
        <TPreview :content="description" class="text-gray-600 text-sm" />
      </slot>
    </dd>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    toggle(title) {
      this.open = !this.open
    },
  },
}
</script>
