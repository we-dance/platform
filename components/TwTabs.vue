<template>
  <nav
    class="isolate flex divide-x divide-gray-200 shadow border-t"
    aria-label="Tabs"
  >
    <component
      :is="tab.to ? 'router-link' : 'button'"
      v-for="(tab, tabIdx) in visibleTabs"
      :key="tab.name"
      v-bind="tab"
      :class="[
        tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
        tabIdx === 0 ? '' : '',
        tabIdx === tabs.length - 1 ? '' : '',
        'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
      ]"
      :aria-current="tab.current ? 'page' : undefined"
      @click.native="() => onClick(tab)"
    >
      <span>{{ tab.name }}</span>
      <span
        aria-hidden="true"
        :class="[
          tab.current ? 'bg-primary' : 'bg-transparent',
          'absolute inset-x-0 bottom-0 h-0.5',
        ]"
      />
    </component>
  </nav>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    track: {
      type: String,
      default: '',
    },
  },
  computed: {
    visibleTabs() {
      return this.tabs.filter((tab) => !tab.hidden)
    },
  },
  methods: {
    onClick(tab) {
      if (this.track) {
        this.$track(this.track + '_' + tab.value)
      }

      this.$emit('input', tab.value)
    },
  },
}
</script>
