<template>
  <nav
    class="isolate flex divide-x divide-gray-200 rounded-lg shadow"
    aria-label="Tabs"
  >
    <router-link
      v-for="(tab, tabIdx) in visibleTabs"
      :key="tab.name"
      :to="tab.to"
      :class="[
        tab.current ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
        tabIdx === 0 ? 'rounded-l-lg' : '',
        tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
        'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10',
      ]"
      :aria-current="tab.current ? 'page' : undefined"
    >
      <span>{{ tab.name }}</span>
      <span
        aria-hidden="true"
        :class="[
          tab.current ? 'bg-primary' : 'bg-transparent',
          'absolute inset-x-0 bottom-0 h-0.5',
        ]"
      />
    </router-link>
  </nav>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    visibleTabs() {
      return this.tabs.filter((tab) => !tab.hidden)
    },
  },
}
</script>
