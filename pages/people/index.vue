<template>
  <div>
    <div class="flex items-baseline justify-between mb-2 border-b">
      <TTabs v-model="tab" :tabs="tabs" />
    </div>

    <TCardList
      :collection="collection"
      :filters="filters"
      class="max-w-md mx-auto"
    >
      <template v-slot:empty>
        <div class="mt-4 mx-auto max-w-md p-4 text-sm">
          <TIcon name="undraw_work_chat" class="p-4" />
          <div>
            People are great, but people near you are even better. Find other
            dancers in your area by publishing your own profile first!
          </div>
          <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
            <div>Sign in to continue</div>
            <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
          </div>
          <div
            v-else-if="!published"
            class="mt-8 bg-gray-400 p-4 rounded text-center"
          >
            <div>Publish your profile to get access</div>
            <TButton class="mt-2" @click="publish">Publish</TButton>
          </div>
        </div>
      </template>
      <template v-slot:default="{ item }">
        <TCardProfile class="mb-4" :uid="item.createdBy" />
      </template>
    </TCardList>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'

export default {
  data: () => ({
    tabs: [
      {
        value: 'members',
        label: 'Members'
      },
      {
        value: 'groups',
        label: 'Groups'
      },
      {
        value: 'artists',
        label: 'Artists'
      },
      {
        value: 'teachers',
        label: 'Teachers'
      }
    ],
    tab: 'members'
  }),
  setup() {
    const collection = 'profiles'

    const { uid } = useAuth()
    const { getProfile } = useProfiles()

    const published = true

    const filters = [
      {
        name: 'all',
        default: true,
        filter: (item) => item.username
      }
    ]

    return {
      collection,
      getDateTime,
      filters,
      uid,
      getProfile,
      published
    }
  }
}
</script>
