<template>
  <div class="flex flex-col">
    <div v-if="editable" class="flex justify-end mb-4">
      <TButton class="mr-2" @click="proccess">Proccess</TButton>
      <TButton class="mr-2" @click="download">Download</TButton>
      <TButton class="mr-2" @click="stats">Stats</TButton>
      <TButton @click="removeSelected">Delete</TButton>
    </div>
    <div class="bg-white py-4 flex flex-row mb-4 items-center border-b">
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
            <div class="float-right -mr-2">
              <TMenu>
                <template v-slot:button>
                  <TButton icon="more_vert" type="icon" />
                </template>
                <template v-slot:menu="{ closeMenu }">
                  <div class="p-4 bg-white rounded-lg shadow-xl border">
                    <TField
                      v-model="item.lists"
                      hide-label
                      type="multi"
                      :options="list"
                      @input="(val) => applyList(item.id, val, closeMenu)"
                    />

                    <TButtonEditProfile :uid="item.id" class="mt-4" />
                  </div>
                </template>
              </TMenu>
            </div>
            <div
              v-if="item.profile.username"
              class="font-bold"
              :class="{ 'text-green-500': item.profile.partner === 'Yes' }"
            >
              {{ item.profile.name }}
              <router-link target="_blank" :to="`/${item.profile.username}`"
                >@{{ item.profile.username }}</router-link
              >
            </div>
            <div
              v-if="item.profile.jobs"
              class="text-xs text-gray-700 max-w-xs"
            >
              {{ item.profile.jobs }}
            </div>
            <div>{{ item.name }} &lt;{{ item.email }}&gt;</div>
            <label>
              <input
                :checked="item.editor"
                type="checkbox"
                @change="updateAccount(item.id, { editor: !item.editor })"
              />
              <span>Editor</span>
            </label>
            <div class="text-xs text-orange-500">
              <span>Community: {{ item.profile.community }}</span>
              <span v-if="item.profile.location">
                • Hometown: {{ item.profile.location.locality }}</span
              >
            </div>
            <pre v-if="item.marketing.ref" class="text-xs">
ref: {{ item.marketing.ref }} <template
              v-if="item.marketing.utms && item.marketing.utms.utm_source"
            >• {{ item.marketing.utms.utm_campaign }} • {{
                item.marketing.utms.utm_medium
              }} • {{ item.marketing.utms.utm_source }}</template
            ></pre>
            <pre class="text-xs">uid: {{ item.id }}</pre>
            <pre v-if="item.profile.locales" class="text-xs">
languages: {{ item.profile.language }} ({{
                Object.keys(item.profile.locales).join(', ')
              }})</pre
            >
            <pre class="text-xs">
last login: {{ getDateTime(item.lastLoginAt) }}</pre
            >
            <pre class="text-xs">joined: {{ getDateTime(item.createdAt) }}</pre>
            <pre class="text-xs">used: {{ item.profile.daysUsed }} days</pre>
            <pre class="text-xs">type: {{ item.profile.type }}</pre>
            <pre class="text-xs">visibility: {{ item.profile.visibility }}</pre>
          </div>
        </div>

        <div class="flex justify-end">
          <div v-if="item.lists" class="text-xs">
            {{ Object.keys(item.lists).join(', ') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, ref } from '@nuxtjs/composition-api'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'
import {
  sortBy,
  getTime,
  getDate,
  getDateTime,
  saveCSV,
  getDateObect
} from '~/utils'
import useProfiles from '~/use/profiles'

export default {
  name: 'TGridAccounts',
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
    const { remove: removeProfile, update: updateProfile } = useDoc('profiles')
    const { remove: removeAccount, update: updateAccount } = useDoc('accounts')
    const { getProfile, contactFields } = useProfiles()
    const nameFilter = ref('')
    const activeFilter = ref('')
    const selectedAll = ref(false)
    const selected = ref({})
    const list = ref([
      {
        value: 'PartnerForm',
        label: 'PartnerForm'
      },
      {
        value: 'PartnerChat',
        label: 'PartnerChat'
      },
      {
        value: 'MontunoClub',
        label: 'MontunoClub'
      },
      {
        value: 'NoProfile',
        label: 'NoProfile'
      }
    ])
    const applyList = (id, lists, closeMenu) => {
      updateAccount(id, {
        lists
      })
      closeMenu()
    }

    const filterOptions = computed(() => [
      {
        value: '',
        label: `Everyone (${docs.value.length})`,
        filter: (account) => true
      },
      {
        value: 'selected',
        label: `Selected (${Object.keys(selected.value).length})`,
        filter: (account) => selected.value[account.id]
      },
      {
        value: 'notype',
        label: 'No Type',
        filter: (account) => !account.profile?.type
      },
      {
        value: 'visibility',
        label: 'No visibility',
        filter: (account) => !account.profile?.visibility
      },
      {
        value: 'socialCover',
        label: 'Social Cover',
        filter: (account) => !!account.profile?.socialCover
      },
      {
        value: 'boosting',
        label: 'Boosting',
        filter: (account) => account.profile?.socialCoverPublish === 'Yes'
      },
      {
        value: 'noboosting',
        label: 'Not boosting',
        filter: (account) => account.profile?.socialCoverPublish === 'No'
      },
      {
        value: 'looking',
        label: 'Looking',
        filter: (account) => account.profile?.partner === 'Yes'
      },
      {
        value: 'not_looking',
        label: 'Not looking',
        filter: (account) => account.profile?.partner !== 'Yes'
      },
      {
        value: 'no_community',
        label: 'No community',
        filter: (account) => !account.profile?.community
      },
      {
        value: 'munich',
        label: 'Munich',
        filter: (account) => account.profile?.community === 'Munich'
      },
      {
        value: 'used_more_10d',
        label: 'More than 10 days',
        filter: (account) => account.profile?.daysUsed > 10
      },
      {
        value: 'used_more_1d',
        label: 'More than 1 day',
        filter: (account) => account.profile?.daysUsed > 1
      },
      {
        value: 'used_less_2d',
        label: 'Less than 2 day',
        filter: (account) => account.profile?.daysUsed < 2
      },
      {
        value: 'no_username',
        label: 'No username',
        filter: (account) => !account.profile?.username
      }
    ])

    const activeFilterItem = computed(() =>
      filterOptions.value.find((item) => item.value === activeFilter.value)
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
          profile: getProfile(item.id),
          lastLoginAt:
            getProfile(item.id).lastLoginAt || +getDateObect(item.lastLoginAt)
        }))
        .filter(activeFilterItem.value.filter)
        .filter((item) => {
          if (!nameFilter.value || !nameFilter.value.toLowerCase) {
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
        .sort(sortBy('-lastLoginAt'))
    )

    return {
      nameFilter,
      activeFilter,
      filterOptions,
      selectedAll,
      items,
      getTime,
      getDateTime,
      selected,
      getDate,
      removeProfile,
      removeAccount,
      list,
      applyList,
      contactFields,
      updateProfile,
      updateAccount
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
    stats() {
      const dances = {}
      const cities = {}

      this.items.forEach((item) => {
        if (!item.profile) {
          return
        }

        if (item.profile.community) {
          cities[item.profile.community] = cities[item.profile.community]
            ? cities[item.profile.community] + 1
            : 1
        }

        if (item.profile.styles) {
          Object.keys(item.profile.styles).forEach((style) => {
            dances[style] = dances[style] ? dances[style] + 1 : 1
          })
        }
      })

      console.log({ dances, cities })
    },
    load() {
      if (!this.value) {
        this.selected = {}
        return
      }

      this.selected = this.value
    },
    log(...opts) {
      return new Promise((resolve) => {
        console.log(...opts)
        return resolve()
      })
    },
    async proccess() {
      const success = []
      const errors = []
      const skipped = []

      for (const item of this.items) {
        try {
          const data = {}

          if (!item.profile?.username) {
            skipped.push({ uid: item.id })
            continue
          }

          await this.log(item.id, data)
          success.push({ uid: item.id })
        } catch (e) {
          errors.push({ uid: item.id, error: e })
        }
      }

      console.log(`Succes: ${success.length}`)
      console.log(`Skipped: ${skipped.length}`)
      console.log(`Failed: ${errors.length}`)
      console.log({ success, skipped, errors })
    },
    download() {
      const flatItems = this.items.map((item) => {
        const flatItem = item

        Object.keys(item.profile).forEach((key) => {
          flatItem[`profile_${key}`] = item.profile[key]
        })
        delete flatItem.profile

        Object.keys(item.marketing).forEach((key) => {
          flatItem[`marketing_${key}`] = item.marketing[key]
        })
        delete flatItem.marketing

        flatItem.createdAt = getDateTime(flatItem.createdAt)
        flatItem.updatedAt = getDateTime(flatItem.updatedAt)
        flatItem.lastLoginAt = getDateTime(flatItem.lastLoginAt)
        flatItem.profile_styles = flatItem.profile_styles
          ? Object.keys(flatItem.profile_styles)
          : ''

        Object.keys(item.marketing_utms).forEach((key) => {
          flatItem[`marketing_utms_${key}`] = item.marketing_utms[key]
        })
        delete flatItem.marketing_utms

        if (item.profile_newsletter) {
          Object.keys(item.profile_newsletter).forEach((key) => {
            flatItem[`profile_newsletter_${key}`] = item.profile_newsletter[key]
          })
          delete flatItem.profile_newsletter
        }

        flatItem.profile_location = flatItem.profile_location
          ? flatItem.profile_location.locality
          : ''

        delete flatItem.marketing_screen

        return flatItem
      })

      saveCSV(flatItems)
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
