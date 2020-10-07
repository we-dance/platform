<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Event not found
  </div>
  <main
    v-else-if="!can('edit', 'events', item)"
    class="mt-4 mx-auto max-w-md p-4 text-sm text-center"
  >
    Only event owner can access this area.
  </main>
  <div v-else>
    <TPopup v-if="addingGuest" title="Add Guest" @close="addingGuest = false">
      <TForm class="mt-4" :fields="reservationFields" @save="addGuest" />
    </TPopup>
    <div class="mx-auto max-w-md bg-real-white p-4">
      <div class="mb-2 flex items-start justify-between">
        <TButton
          class="hover:text-blue-500"
          type="link"
          label="Add participant"
          @click="addingGuest = true"
        />
        <TButton
          :to="`/events/${item.id}/`"
          class="hover:text-blue-500"
          type="link"
          label="View Event"
        />
      </div>
      <div class="px-4 mx-auto max-w-2xl text-center">
        <div class="uppercase text-red-600">
          <span>{{ getDate(item.startDate) }}</span>
          <span>{{ getTime(item.startDate) }}</span>
          –
          <span v-if="getDate(item.startDate) !== getDate(item.endDate)">{{
            getDate(item.endDate)
          }}</span>
          {{ getTime(item.endDate) }}
        </div>
        <h1 class="text-4xl font-bold leading-none">
          {{ item.name }}
        </h1>
      </div>
      <div>
        <TGridParticipants :items="participants" :filters="filters">
          <template v-slot="{ item }">
            <div class="mt-4 flex justify-between">
              <TButton
                v-if="item.state !== 'in'"
                type="danger"
                @click="update(item.id, { rsvp: 'up', state: 'in' })"
                >Check In</TButton
              >
              <TButton
                v-else
                type="success"
                @click="update(item.id, { rsvp: 'up', state: 'out' })"
                >Checked In</TButton
              >
              <TButton
                icon="delete"
                color="red-500"
                @click="update(item.id, { rsvp: 'down', state: 'out' })"
              />
            </div>
          </template>
        </TGridParticipants>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useRSVP from '~/use/rsvp'
import useRouter from '~/use/router'
import useProfiles from '~/use/profiles'
import useReactions from '~/use/reactions'
import useAccounts from '~/use/accounts'
import { getDateTime, getDate, getTime, dateDiff, sortBy } from '~/utils'

export default {
  layout: 'public',
  setup() {
    const addingGuest = ref(false)
    const { uid, can, account } = useAuth()
    const { params } = useRouter()
    const { getProfile } = useProfiles()
    const { accountFields } = useAccounts()

    const { doc, load, exists, loading } = useDoc('events')
    const { map } = useReactions()

    const { update, updateRsvp, createGuestRsvp, getListRsvps } = useRSVP()

    if (params.id) {
      load(params.id)
    }

    const participants = computed(() =>
      getListRsvps(params.id)
        .map((item) => ({
          name: item.participant.name,
          email: item.participant.email,
          phone: item.participant.phone,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          createdBy: item.createdBy,
          uid: item.uid,
          id: item.id,
          state: item.state,
          rsvp: item.rsvp,
          withPartner: item.participant.withPartner,
          search: item.participant.name + item.participant.email
        }))
        .sort(sortBy('name'))
    )

    const item = computed(() => map(doc.value))

    const reservationFields = accountFields

    const reservationPopup = ref(false)
    const isCreatingProfile = ref(false)

    const finishReservation = () => {
      reservationPopup.value = false
    }

    const filters = computed(() => [
      {
        value: '',
        label: 'Attending',
        filter: (item) => item.rsvp === 'up'
      },
      {
        value: 'in',
        label: 'Checked in',
        filter: (item) => item.rsvp === 'up' && item.state === 'in'
      },
      {
        value: 'out',
        label: 'Not checked in',
        filter: (item) => item.rsvp === 'up' && item.state !== 'in'
      },
      {
        value: 'canceled',
        label: 'Canceled',
        filter: (item) => item.rsvp === 'down'
      }
    ])

    const reserve = async (participant) => {
      await createGuestRsvp(params.id, 'events', 'up', participant)
    }

    const addGuest = async (participant) => {
      await reserve(participant)
      addingGuest.value = false
    }

    return {
      addGuest,
      addingGuest,
      filters,
      isCreatingProfile,
      finishReservation,
      account,
      reservationPopup,
      reservationFields,
      reserve,
      exists,
      uid,
      loading,
      item,
      map,
      updateRsvp,
      update,
      can,
      getProfile,
      getDateTime,
      dateDiff,
      getDate,
      getTime,
      participants
    }
  }
}
</script>
