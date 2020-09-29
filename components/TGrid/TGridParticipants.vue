<template>
  <div class="flex flex-col">
    <div class="flex justify-end mt-4">
      <TButton class="mr-2" @click="download">Export CSV</TButton>
    </div>
    <div class="py-4 flex flex-row mb-4 items-center border-b">
      <input
        v-model="selectedAll"
        type="checkbox"
        class="mb-2 md:ml-2 md:mb-0"
        @click="selectAll(!selectedAll)"
      />

      <TInputSelect
        v-model="activeFilter"
        class="mb-2 md:ml-2 md:mb-0"
        :options="filterOptions"
      />

      <TInput
        v-model="nameFilter"
        class="mb-2 md:ml-2 md:mb-0"
        placeholder="Search"
      />
    </div>

    <div :class="{ 'overflow-y-scroll h-64': verticalScroll }">
      <div class="mb-4 text-center text-xs">{{ items.length }} users</div>
      <div
        v-for="item in items"
        :key="item.id"
        :class="{ 'border-green-500': item.selected }"
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
            <TProfilePhoto size="lg" :uid="item.id" class="mr-2" />
          </div>
          <div class="flex-grow">
            <div class="font-bold">{{ item.name }}</div>
            <div>{{ item.email }}</div>
            <div>{{ item.phone }}</div>
            <pre class="text-xs">Updated: {{ getDate(item.updatedAt) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, ref } from '@nuxtjs/composition-api'
import { getTime, getDate, saveCSV } from '~/utils'

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
    multi: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const nameFilter = ref('')
    const activeFilter = ref('')
    const selectedAll = ref(false)
    const selected = ref({})

    const filterOptions = computed(() => [
      {
        value: '',
        label: `Everyone (${props.items.length})`,
        filter: (item) => true
      }
    ])

    // const activeFilterItem = computed(() =>
    //   filterOptions.value.find((item) => item.value === activeFilter.value)
    // )

    // const matchString = (str, match) => {
    //   if (!str) {
    //     return false
    //   }

    //   return str.toLowerCase().includes(match)
    // }

    return {
      nameFilter,
      activeFilter,
      filterOptions,
      selectedAll,
      getTime,
      selected,
      getDate
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
      this.items.forEach((item) => {
        this.select(item, mark)
      })
    }
  }
}
</script>
