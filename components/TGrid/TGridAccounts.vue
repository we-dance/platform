<template>
  <div class="flex flex-col">
    <div v-if="editable" class="flex justify-end mb-4">
      <TButton @click="removeSelected">Delete</TButton>
    </div>
    <div class="bg-white py-4 flex flex-row mb-4 items-center z-50 border-b">
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
            <div class="text-xs text-orange-500">
              {{ item.profile.community
              }}<span v-if="item.profile.city"> • {{ item.profile.city }}</span>
              <span v-if="item.profile.location">
                • {{ item.profile.location.locality }}</span
              >
            </div>
            <div class="text-xs">
              {{ item.profile.contacts }}
            </div>
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
import useDoc from '~/use/doc'
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
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { docs } = useCollection('accounts')
    const { remove: removeProfile } = useDoc('profiles')
    const { remove: removeAccount } = useDoc('accounts')
    const { getProfile } = useProfiles()
    const nameFilter = ref('')
    const activeFilter = ref('')
    const selectedAll = ref(false)
    const selected = ref({})

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
        filter: (account) => !account.profile.community
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

    const matchString = (str, match) => {
      if (!str) {
        return false
      }

      return str.toLowerCase().includes(match)
    }

    const items = computed(() =>
      docs.value
        .map((item) => ({
          ...item,
          profile: getProfile(item.id)
        }))
        .filter(activeFilterItem.value.filter)
        .filter((item) => {
          if (!nameFilter.value) {
            return true
          }

          const search = nameFilter.value.toLowerCase()

          return (
            matchString(item.name, search) ||
            matchString(item.profile?.name, search) ||
            matchString(item.profile?.username, search) ||
            matchString(item.email, search)
          )
        })
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
      removeProfile,
      removeAccount
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
    removeSelected() {
      Object.keys(this.selected).forEach((uid) => {
        this.removeAccount(uid)
        this.removeProfile(uid)
      })

      this.selected = {}
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
