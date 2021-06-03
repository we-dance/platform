<template>
  <div v-if="!isAdmin" class="mt-4 mx-auto max-w-md p-4 text-sm text-center">
    Only admin can access this area.
  </div>
  <main v-else class="p-4">
    <TCardList
      :collection="collection"
      :title="title"
      :filters="filters"
      :map="map"
      :delete-item="true"
    >
      <template v-slot="{ item }">
        <div class="p-4 card-item">
          <div class="font-bold text-xl mb-2">
            {{ item.name }}
          </div>
          <div class="md:flex justify-between">
            <dl class="w-full">
              <div
                v-for="field in [
                  'feedback',
                  'uid',
                  'collection',
                  'eventId',
                  'rsvp'
                ]"
                :key="field"
                class="flex"
              >
                <template v-if="item[field]">
                  <dt class="w-1/3 text-right mr-2 text-gray-500">
                    {{ field }}
                  </dt>
                  <dd>{{ item[field] }}</dd>
                </template>
              </div>
              <div
                v-if="item.participant && item.participant.email"
                class="flex"
              >
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  email
                </dt>
                <dd>{{ item.participant.email }}</dd>
              </div>
              <div class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  account
                </dt>
                <dd v-if="item.account && item.uid">
                  {{ item.account.id }}
                </dd>
                <dd
                  v-if="item.account && !item.uid"
                  class="font-bold underline cursor-pointer"
                  @click="update(item.id, { uid: item.account.id })"
                >
                  {{ item.account.id }}
                </dd>
                <dd v-if="!item.account" class="text-red-500">no</dd>
              </div>
              <div v-if="item.nickname" class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  nickname
                </dt>
                <dd>{{ item.nickname }}</dd>
              </div>
              <div
                v-if="item.participant && item.participant.name"
                class="flex"
              >
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  name
                </dt>
                <dd>{{ item.participant.name }}</dd>
              </div>
              <div v-if="item.event && item.event.name" class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  event
                </dt>
                <dd>{{ item.event.name }}</dd>
              </div>
              <div class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  responded
                </dt>
                <dd>
                  {{ getDate(item.createdAt) }} at {{ getTime(item.createdAt) }}
                </dd>
              </div>
              <div v-if="item.updatedAt" class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  updated
                </dt>
                <dd>
                  {{ getDate(item.updatedAt) }} at {{ getTime(item.updatedAt) }}
                </dd>
              </div>
              <div v-if="item.joinedAt" class="flex">
                <dt class="w-1/3 text-right mr-2 text-gray-500">
                  joined
                </dt>
                <dd>
                  {{ getDate(item.joinedAt) }} at {{ getTime(item.joinedAt) }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </template>
    </TCardList>
  </main>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useAccounts } from '~/use/accounts'
import { useRsvp } from '~/use/rsvp'
import TCardList from '~/components/TCardList'
import { getDay, getTime, getDate } from '~/utils'

export default {
  middleware: ['auth'],
  components: {
    TCardList
  },
  setup() {
    const title = 'RSVPs'
    const collection = 'participants'

    const { can, isAdmin } = useAuth()
    const { getAccountByEmail } = useAccounts()
    const { update } = useRsvp()

    const fields = []

    const map = (item) => ({
      ...item,
      account: item.participant.email
        ? getAccountByEmail(item.participant.email)
        : null
    })

    const filters = [
      // {
      //   name: 'new',
      //   label: 'New',
      //   default: true,
      //   sort: '-createdAt'
      // },
      {
        name: 'assign',
        label: 'Assign',
        filter: (item) =>
          !item.uid &&
          item.rsvp === 'up' &&
          item.collection === 'events' &&
          item.account,
        default: true,
        sort: '-createdAt'
      },
      {
        name: 'noaccount',
        label: 'No Account',
        filter: (item) =>
          !item.uid && item.rsvp === 'up' && item.collection === 'events',
        sort: '-createdAt'
      },
      {
        name: 'checkin',
        label: 'Check in',
        filter: (item) => item.rsvp === 'up' && item.state === 'in',
        sort: '-createdAt'
      },
      {
        name: 'yes',
        label: 'Yes',
        filter: (item) => item.rsvp === 'up',
        sort: '-createdAt'
      },
      {
        name: 'no',
        label: 'No',
        filter: (item) => item.rsvp === 'down',
        sort: '-createdAt'
      }
      // {
      //   name: 'feedback',
      //   label: 'Feedback',
      //   filter: (item) => !!item.feedback,
      //   sort: '-updatedAt'
      // }
    ]

    return {
      map,
      can,
      getDay,
      getTime,
      getDate,
      fields,
      title,
      collection,
      isAdmin,
      filters,
      update
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
  }
}
</script>
