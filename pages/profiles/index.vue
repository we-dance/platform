<template>
  <TCardList
    :collection="collection"
    :title="title"
    :add="add"
    :fields="profileFields"
    :item-label="getLabel"
  >
    <template v-slot:empty>
      <div class="text-center mt-4">
        {{ empty }}
      </div>
    </template>
    <template v-slot:editor-header="{ item }">
      <div class="mb-4">
        <TButton @click="importProfile(item.id)">Import from Account</TButton>
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
        <div>@{{ item.username }}</div>
      </div>
    </template>
  </TCardList>
</template>

<script>
import clean from 'lodash-clean'
import useAccounts from '~/use/accounts'
import useProfiles from '~/use/profiles'
import useDoc from '~/use/doc'

export default {
  setup() {
    const { getAccount } = useAccounts()
    const { profileFields } = useProfiles()
    const { update } = useDoc('profiles')

    const collection = 'profiles'
    const title = 'Profiles'
    const add = 'Add Profile'
    const empty = 'There are no profiles yet.'

    const importProfile = (id) => {
      const {
        username,
        name,
        photo,
        location,
        summary,
        skills,
        learning
      } = getAccount(id)

      const data = {
        username,
        name,
        photo,
        bio: summary,
        city: location,
        skills,
        learning
      }

      update(id, clean(data))
    }

    const getLabel = (item) => {
      return getAccount(item.id).name
    }

    return {
      importProfile,
      collection,
      profileFields,
      empty,
      title,
      add,
      getAccount,
      getLabel
    }
  }
}
</script>
