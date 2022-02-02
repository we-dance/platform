<template>
  <div class="flex flex-col">
    <TInputSelect v-model="activeFilter" class="mt-4" :options="filters" />

    <TInput v-model="nameFilter" class="mt-4" placeholder="Search" />

    <div :class="{ 'overflow-y-scroll h-64': verticalScroll }" class="mt-4">
      <div class="flex justify-center mb-4 text-xs space-x-2">
        <div class="underline cursor-pointer" @click="selectAll(!selectedAll)">
          {{ filteredItems.length }} shown
        </div>
        <div>{{ coupleCount * 2 + femaleCount + maleCount }} total</div>
        <div>{{ coupleCount }} couples</div>
        <div>{{ femaleCount }} female</div>
        <div>{{ maleCount }} male</div>
      </div>
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="p-4 mb-4 border rounded"
        :class="selected[item.id] ? 'border-green-500' : 'border-gray-500'"
      >
        <slot :item="item" :tab="activeFilter" :view="view" :select="select" />
      </div>
    </div>

    <TField
      v-model="view"
      component="TInputSelect"
      label="Cards View"
      class="mt-4"
      :options="['name', 'contacts']"
    />

    <div class="mt-4 justify-end flex">
      <a href="#" class="underline text-blue-500" @click="download"
        >Export CSV</a
      >
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, ref } from '@nuxtjs/composition-api'
import { getTime, getDate, getDateTime, saveCSV } from '~/utils'

export default {
  name: 'TGridParticipants',
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [],
    },
    filters: {
      type: Array,
      default: () => [],
    },
    multi: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    verticalScroll: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const nameFilter = ref('')
    const activeFilter = ref('')
    const selectedAll = ref(false)
    const selected = ref({})
    const view = ref('name')

    const activeFilterItem = computed(() =>
      props.filters.find((item) => item.value === activeFilter.value)
    )

    const matchString = (str, match) => {
      if (!str) {
        return false
      }

      return str.toLowerCase().includes(match)
    }

    const filteredItems = computed(() =>
      props.items.filter(activeFilterItem.value.filter).filter((item) => {
        if (!nameFilter.value || !nameFilter.value.toLowerCase) {
          return true
        }

        const search = nameFilter.value.toLowerCase()

        return matchString(item.search, search)
      })
    )

    const coupleCount = computed(
      () => filteredItems.value.filter((item) => item.couple === 'Yes').length
    )

    const femaleCount = computed(
      () =>
        filteredItems.value.filter(
          (item) => item.couple === 'No' && item.gender === 'Female'
        ).length
    )

    const maleCount = computed(
      () =>
        filteredItems.value.filter(
          (item) => item.couple === 'No' && item.gender === 'Male'
        ).length
    )

    return {
      view,
      nameFilter,
      activeFilter,
      selectedAll,
      getTime,
      selected,
      getDate,
      getDateTime,
      filteredItems,
      coupleCount,
      femaleCount,
      maleCount,
    }
  },
  computed: {
    count() {
      return Object.keys(this.selected).length
    },
  },
  watch: {
    value: 'load',
    selected(val) {
      this.$emit('input', val)
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      if (!this.value) {
        this.selected = {}
        return
      }

      this.selected = this.value
    },
    download() {
      const items = this.items
        .filter((item) => item.rsvp === 'up')
        .map((item) => ({
          name: item.name,
          email: item.email,
          phone: item.phone,
          covid: item.covid,
          comment: item.comment,
        }))

      saveCSV(items)
    },
    select(item, mark) {
      if (!item.email) {
        return
      }

      if (typeof mark === 'undefined') {
        mark = !this.selected[item.id]
      }

      if (mark) {
        Vue.set(this.selected, item.id, {
          email: item.email,
          name: item.name || item.email,
        })
      } else {
        Vue.delete(this.selected, item.id)
      }
    },
    selectAll(mark) {
      this.selectedAll = !this.selectedAll

      this.filteredItems.forEach((item) => {
        this.select(item, mark)
      })
    },
  },
}
</script>
