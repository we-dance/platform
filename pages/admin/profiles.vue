<template>
  <main>
    <div class="mb-4">
      <TButton @click="updateCities">Update cities</TButton>
    </div>
    <TCardList
      :collection="collection"
      :title="title"
      :add="add"
      :fields="profileFields"
      :filters="filters"
      :item-label="getLabel"
    >
      <template v-slot:empty>
        <div class="text-center mt-4">
          {{ empty }}
        </div>
      </template>
      <template v-slot:default="{ item }">
        <div class="rounded bg-white mb-4 shadow border p-4">
          <div class="text-xs">
            {{ getLabel(item) }}
          </div>
          <div class="font-bold">
            {{ item.name }}
          </div>
          <div>
            <span v-if="item.location">{{ item.location.locality }}</span> •
            {{ item.community }}
          </div>
          <div @click="selectedId = item.id">@{{ item.username }}</div>
          <div v-if="selectedId === item.id">
            <h2 class="font-bold">Profile</h2>
            <pre>{{ item }}</pre>
            <h2 class="font-bold">Account</h2>
            <pre>{{ getAccount(item.id) }}</pre>
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import useAccounts from '~/use/accounts'
import useProfiles from '~/use/profiles'
import useCollection from '~/use/collection'
import useDoc from '~/use/doc'

export default {
  setup() {
    const { getAccount } = useAccounts()
    const { profileFields } = useProfiles()
    const { update } = useDoc('profiles')
    const { docs: profiles } = useCollection('profiles')

    const collection = 'profiles'
    const title = 'Profiles'
    const add = 'Add Profile'
    const empty = 'There are no profiles yet.'

    const filters = [
      {
        default: true,
        name: 'all',
        filter: (item) => item.username
      }
    ]

    const getLabel = (item) => {
      return getAccount(item.id).name
    }

    return {
      collection,
      profileFields,
      empty,
      title,
      add,
      getAccount,
      getLabel,
      filters,
      profiles,
      update
    }
  },
  data: () => ({
    selectedId: ''
  }),
  methods: {
    updateCities() {
      this.profiles.forEach((profile) => {
        this.update(profile.id, { community: 'Munich' })
      })
    }
  }
}
</script>
