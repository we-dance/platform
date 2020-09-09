<template>
  <div class="flex flex-col">
    <div
      class="sticky top-0 bg-white py-4 flex flex-col md:flex-row mb-4 items-center z-50 border-b"
    >
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
      <div
        v-for="item in items"
        :key="item.id"
        :class="{ 'border-green-500': item.selected }"
        class="p-4 mb-4 border border-gray-500 rounded"
      >
        <div class="flex flex-col md:flex-row">
          <div class="">
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
            <div
              v-if="item.profile.username"
              class="font-bold"
              :class="{ 'text-green-500': item.profile.partner === 'Yes' }"
            >
              {{ item.profile.name }} @{{ item.profile.username }}
            </div>
            <div
              v-if="item.profile.jobs"
              class="text-xs text-gray-700 max-w-xs"
            >
              {{ item.profile.jobs }}
            </div>
            <div>{{ item.name }} &lt;{{ item.email }}&gt;</div>
            <div v-if="item.profile.location" class="text-xs text-orange-500">
              {{ item.profile.location.locality }}
            </div>
          </div>
          <div>
            <TInputSelect :options="accountStates" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, ref } from '@vue/composition-api'
import useCollection from '~/use/collection'
import { sortBy, getTime, getDate } from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  props: {
    value: {
      type: [Object, String],
      default: () => ({})
    },
    verticalScroll: {
      type: Boolean,
      default: false
    },
    multi: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { docs } = useCollection('accounts')
    const { getProfile } = useProfiles()
    const nameFilter = ref('')
    const activeFilter = ref('')
    const selectedAll = ref(false)
    const selected = ref({})

    const accountStates = [
      {
        value: '',
        label: 'New'
      },
      {
        value: 'test',
        label: 'Test'
      }
    ]

    const filterOptions = [
      {
        value: '',
        label: 'Everyone',
        filter: (account) => true
      },
      {
        value: 'selected',
        label: 'Selected',
        filter: (account) => selected.value[account.id]
      },
      {
        value: 'looking',
        label: 'Looking',
        filter: (account) => account.profile.partner === 'Yes'
      },
      {
        value: 'not_looking',
        label: 'Not looking',
        filter: (account) => account.profile.partner !== 'Yes'
      },
      {
        value: 'no_city',
        label: 'No city',
        filter: (account) => !account.profile.location
      },
      {
        value: 'no_username',
        label: 'No username',
        filter: (account) => !account.profile.username
      }
    ]

    const activeFilterItem = computed(() =>
      filterOptions.find((item) => item.value === activeFilter.value)
    )

    const items = computed(() =>
      docs.value
        .map((item) => ({
          ...item,
          profile: getProfile(item.id)
        }))
        .filter(activeFilterItem.value.filter)
        .filter(
          (item) =>
            item.name?.includes(nameFilter.value) ||
            item.profile?.name?.includes(nameFilter.value) ||
            item.profile?.username?.includes(nameFilter.value) ||
            item.email?.includes(nameFilter.value)
        )
        .sort(sortBy('-createdAt'))
    )

    return {
      nameFilter,
      activeFilter,
      filterOptions,
      selectedAll,
      items,
      getTime,
      selected,
      getDate,
      accountStates
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
