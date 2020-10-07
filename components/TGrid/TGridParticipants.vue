<template>
  <div class="flex flex-col">
    <div class="py-4 mb-4 md:flex items-center border-b">
      <TInputSelect
        v-model="activeFilter"
        class="mb-2 md:ml-2 md:mb-0"
        :options="filters"
      />

      <TInput
        v-model="nameFilter"
        class="mb-2 md:ml-2 md:mb-0"
        placeholder="Search"
      />
    </div>

    <div :class="{ 'overflow-y-scroll h-64': verticalScroll }">
      <div
        class="underline mb-4 text-center text-xs"
        @click="selectAll(!selectedAll)"
      >
        {{ filteredItems.length }} users
      </div>
      <div
        v-for="item in filteredItems"
        :key="item.id"
        :class="{ 'border-green-500': selected[item.id] }"
        class="p-4 mb-4 border border-gray-500 rounded"
      >
        <div class="flex flex-col md:flex-row">
          <div>
            <div
              class="border w-4 h-4 rounded-full border-gray-500 mr-2"
              :class="selected[item.id] ? 'bg-green-500 border-green-500' : ''"
              @click="select(item)"
            ></div>
          </div>
          <div>
            <TProfilePhoto size="lg" :uid="item.uid" class="mr-2" />
          </div>
          <div class="flex-grow">
            <div class="font-bold">{{ item.name }}</div>
            <div>{{ item.email }}</div>
            <div>{{ item.phone }}</div>
            <div>With partner? {{ item.withPartner }}</div>
            <pre class="text-xs">
Updated: {{ getDateTime(item.updatedAt) }}</pre
            >
            <slot :item="item" />
          </div>
        </div>
      </div>
    </div>

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
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    },
    multi: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    verticalScroll: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const nameFilter = ref('')
    const activeFilter = ref('')
    const selectedAll = ref(false)
    const selected = ref({})

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

    return {
      nameFilter,
      activeFilter,
      selectedAll,
      getTime,
      selected,
      getDate,
      getDateTime,
      filteredItems
    }
  },
  computed: {
    count() {
      return Object.keys(this.selected).length
    }
  },
  watch: {
    value: 'load',
    selected(val) {
      this.$emit('input', val)
    }
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
      saveCSV(this.items)
    },
    select(item, mark) {
      if (typeof mark === 'undefined') {
        mark = !this.selected[item.id]
      }

      if (mark) {
        Vue.set(this.selected, item.id, {
          email: item.email,
          name: item.name
        })
      } else {
        Vue.delete(this.selected, item.id)
      }
    },
    selectAll(mark) {
      this.selectedAll = !this.selectedAll

      this.items.forEach((item) => {
        this.select(item, mark)
      })
    }
  }
}
</script>
