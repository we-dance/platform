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
      <div class="my-2 flex items-start justify-between">
        <TButton label="Add participant" @click="addingGuest = true" />
        <TButton :to="`/events/${item.id}/`" label="View Event" />
      </div>
      <div>
        <TGridParticipants :items="participants" :filters="filters">
          <template v-slot="{ item, tab, view }">
            <div v-if="tab === 'couples'" class="flex justify-between">
              <div>
                <TProfilePhoto size="lg" :uid="item.uid" />
                <div class="font-bold mt-2">{{ item.name }}</div>
              </div>
              <div v-if="item.partnerId" class="flex flex-col items-end">
                <TProfilePhoto size="lg" :uid="item.partner.uid" />
                <div class="font-bold mt-2">{{ item.partner.name }}</div>
              </div>
              <div v-if="item.couple === 'Yes'">
                Unregistered Partner
              </div>
            </div>
            <div v-if="tab !== 'couples'" class="flex flex-col md:flex-row">
              <div>
                <TProfilePhoto size="lg" :uid="item.uid" class="mr-2" />
              </div>
              <div class="flex-grow">
                <div
                  class="font-bold"
                  :class="{ 'text-green-500': !!item.uid }"
                >
                  {{ item.name }}
                </div>
                <div v-if="view === 'contacts'">
                  <div>{{ item.email }}</div>
                  <div>{{ item.phone }}</div>
                  <div class="text-xs">{{ getDateTime(item.createdAt) }}</div>
                </div>
                <div v-if="tab === ''">
                  <div>
                    Couple:
                    <button
                      class="underline hover:no-underline"
                      @click="
                        update(item.id, {
                          couple: item.couple !== 'Yes' ? 'Yes' : 'No'
                        })
                      "
                    >
                      {{ item.couple || 'Not set' }}
                    </button>
                  </div>
                  <div>
                    Gender:
                    <button
                      class="underline hover:no-underline"
                      @click="
                        update(item.id, {
                          gender: item.gender !== 'Male' ? 'Male' : 'Female'
                        })
                      "
                    >
                      {{ item.gender || 'Not set' }}
                    </button>
                  </div>
                  <div>
                    <TMenu2
                      v-if="!item.partnerId"
                      wrapped
                      label="Link"
                      type="link"
                    >
                      <TButton
                        v-for="candidate in getCandidates(item)"
                        :key="candidate.id"
                        type="nav"
                        @click="
                          update(item.id, { partnerId: candidate.id })
                          update(candidate.id, { partnerId: item.id })
                        "
                        >{{ candidate.name }}</TButton
                      >
                    </TMenu2>
                    <TButton
                      v-if="item.partnerId"
                      type="link"
                      @click="
                        update(item.partnerId, { partnerId: '' })
                        update(item.id, { partnerId: '' })
                      "
                      >{{ item.partner.name }} (Unlink)</TButton
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-between">
              <TButton
                v-if="item.state !== 'in' && tab === 'out'"
                type="danger"
                @click="update(item.id, { rsvp: 'up', state: 'in' })"
                >Check In</TButton
              >
              <TButton
                v-if="item.state === 'in' && tab === 'in'"
                type="success"
                @click="update(item.id, { rsvp: 'up', state: 'out' })"
                >Checked In</TButton
              >
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

    const participantsMap = computed(() =>
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
          gender: item.gender,
          partnerId: item.partnerId,
          couple:
            item.couple || item.withPartner || item.participant.withPartner,
          search: item.participant.name + item.participant.email
        }))
        .sort(sortBy('name'))
    )

    const getParticipant = (id) => {
      return participantsMap.value.find((participant) => participant.id === id)
    }

    const participants = computed(() =>
      participantsMap.value.map((participant) => ({
        ...participant,
        partner: getParticipant(participant.partnerId)
      }))
    )

    const item = computed(() => map(doc.value))

    const reservationFields = accountFields

    const reservationPopup = ref(false)
    const isCreatingProfile = ref(false)

    const finishReservation = () => {
      reservationPopup.value = false
    }

    const getCandidates = (candidate) => {
      return participants.value.filter(
        (participant) =>
          participant.rsvp === 'up' &&
          !participant.partnerId &&
          participant.id !== candidate.id &&
          participant.gender !== candidate.gender &&
          participant.couple === 'No'
      )
    }

    const filters = computed(() => [
      {
        value: '',
        label: 'Prepare event (list of registered)',
        filter: (item) => item.rsvp === 'up'
      },
      {
        value: 'out',
        label: 'Check in (list of not checked in)',
        filter: (item) => item.rsvp === 'up' && item.state !== 'in'
      },
      {
        value: 'in',
        label: 'During event (list of checked in)',
        filter: (item) => item.rsvp === 'up' && item.state === 'in'
      },
      {
        value: 'couples',
        label: 'Couples',
        filter: (item) =>
          (!!item.partnerId && item.gender === 'Male') || item.couple === 'Yes'
      },
      {
        value: 'no_couple',
        label: 'No couple',
        filter: (item) => !item.partnerId && item.couple === 'No'
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
      getCandidates,
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
