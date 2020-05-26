<template>
  <div>
    <TCardList :collection="collection" title="People" :filters="filters">
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
        <div>
          <div class="bg-white mb-4 rounded border shadow p-4 max-w-sm">
            <router-link
              :to="`/u/${getProfile(item.createdBy).username}`"
              class="text-sm flex items-center"
            >
              <img
                class="rounded-full mr-2 w-10 h-10"
                :src="getProfile(item.createdBy).photo"
              />
              <div>
                <div class="font-bold">
                  {{ getProfile(item.createdBy).name }}
                </div>
                <div class="text-gray-600">
                  @{{ getProfile(item.createdBy).username }}
                </div>
              </div>
            </router-link>
            <div class="text-sm mt-2">
              <div v-if="getProfile(item.createdBy).bio">
                {{ getProfile(item.createdBy).bio }}
              </div>
              <dl
                v-if="getProfile(item.createdBy).city"
                class="mt-2 flex items-center"
              >
                <dt>
                  <TIcon class="w-4 h-4 mr-1 text-blue-500" name="place" />
                </dt>
                <dd>{{ getProfile(item.createdBy).city }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'

export default {
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
