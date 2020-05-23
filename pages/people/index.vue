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
              :to="`/u/${getAccount(item.createdBy).username}`"
              class="text-sm flex items-center"
            >
              <img
                class="rounded-full mr-2 w-10 h-10"
                :src="getAccount(item.createdBy).photo"
              />
              <div>
                <div class="font-bold">
                  {{ getAccount(item.createdBy).name }}
                </div>
                <div class="text-gray-600">
                  @{{ getAccount(item.createdBy).username }}
                </div>
              </div>
            </router-link>
            <div class="text-sm mt-2">
              <div>{{ getAccount(item.createdBy).summary }}</div>
              <dl class="mt-2">
                <dt class="font-bold mr-1">Location:</dt>
                <dd>{{ getAccount(item.createdBy).location }}</dd>
              </dl>
              <dl class="mt-2">
                <dt class="font-bold mr-1">Joined:</dt>
                <dd>{{ getDateTime(getAccount(item.createdBy).createdAt) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </template>
    </TCardList>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { getDateTime } from '~/utils'
import useAuth from '~/use/auth'
import useAccounts from '~/use/accounts'

export default {
  methods: {
    publish() {
      if (!this.account.summary || this.account.username) {
        this.$router.push('/account?tab=settings')
      } else {
        this.updateAccount({
          published: true
        })
      }
    }
  },
  setup() {
    const collection = 'accounts'

    const { uid, account, updateAccount } = useAuth()
    const { getAccount } = useAccounts()

    const published = computed(() => account.value?.published)

    const filters = [
      {
        name: 'all',
        default: true,
        filter: (item) => item.published && published.value
      }
    ]

    return {
      collection,
      getDateTime,
      filters,
      uid,
      account,
      getAccount,
      published,
      updateAccount
    }
  }
}
</script>
