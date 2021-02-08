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
    <TPopup v-if="compose" title="Compose email" @close="compose = false">
      <div class="max-w-lg">
        <div class="text-xs mt-4">
          {{ selectedParticipantsList.length }} recipients:
          {{ selectedParticipantsList.join(', ') }}
        </div>
        <TForm
          class="mt-4"
          :value="{ subject: item.name }"
          :fields="emailFields"
          submit-label="Send"
          @save="sendEmail"
        />
      </div>
    </TPopup>
    <TPopup v-if="addingGuest" title="Add Guest" @close="addingGuest = false">
      <TForm class="mt-4" :fields="reservationFields" @save="addGuest" />
    </TPopup>
    <div class="mx-auto max-w-md bg-white p-4">
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
        <TButton label="Email" @click="compose = true" />
        <TButton :to="`/events/${item.id}/`" label="View Event" />
      </div>
      <div>
        <TGridParticipants
          v-model="selectedParticipants"
          :items="participants"
          :filters="filters"
        >
          <template v-slot="{ item, tab, view, select }">
            <div v-if="tab === 'couples'" class="flex justify-between">
              <div>
                <TProfilePhoto size="lg" :uid="item.uid" />
                <div
                  class="font-bold mt-2"
                  :class="{ 'text-red-500': item.rsvp === 'down' }"
                >
                  {{ item.name }}
                </div>
                <TButton
                  v-if="item.partnerId"
                  type="link"
                  class="mt-4 text-red-500"
                  @click="
                    update(item.partnerId, { partnerId: '' })
                    update(item.id, { partnerId: '' })
                  "
                  >Unlink</TButton
                >
              </div>
              <div
                v-if="item.partnerId"
                class="flex flex-col items-end text-right"
              >
                <TProfilePhoto size="lg" :uid="item.partner.uid" />
                <div
                  class="font-bold mt-2"
                  :class="{ 'text-red-500': item.partner.rsvp === 'down' }"
                >
                  {{ item.partner.name }}
                </div>
              </div>
              <div v-else-if="item.couple === 'Yes'" class="text-right">
                <TButton label="Add" @click="addingGuest = item.id" />
              </div>
            </div>
            <div v-if="tab !== 'couples'" class="flex flex-col md:flex-row">
              <div class="mr-2 cursor-pointer" @click="select(item)">
                <TIcon
                  v-if="selectedParticipants[item.id]"
                  name="check"
                  class="w-10 h-10 border-2 rounded-full bg-green-500 text-white"
                />
                <TProfilePhoto
                  v-else
                  size="lg"
                  :uid="item.uid"
                  class="border-2"
                />
              </div>
              <div class="flex-grow">
                <div class="float-right">
                  <TButton
                    v-if="tab === 'in'"
                    type="round"
                    @click="update(item.id, { rsvp: 'up', state: 'out' })"
                  >
                    <TIcon name="rotate_right" class="text-red-500 w-4 h-4" />
                  </TButton>
                </div>
                <div
                  class="font-bold"
                  :class="{ 'text-green-500': !!item.uid }"
                >
                  {{ item.name }}
                </div>
                <div v-if="tab === 'in'">
                  <div class="flex flex-wrap space-x-2">
                    <div
                      v-for="(note, noteId) in item.notesArray"
                      :key="noteId"
                      class="p-2 bg-gray-200 rounded"
                    >
                      {{ note }}
                    </div>
                  </div>
                  <TMenu2 wrapped label="Add note" type="link">
                    <TButton
                      v-for="(note, noteId) in notes"
                      :key="noteId"
                      type="nav"
                      @click="addNote(item, note)"
                      >{{ note }}</TButton
                    >
                  </TMenu2>
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
                      {{ item.couple || 'Not set' }} {{ item.partnerName }}
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
            <div class="mt-4 flex justify-start space-x-2">
              <TButton
                v-if="tab === ''"
                type="danger"
                @click="update(item.id, { rsvp: 'down', state: 'out' })"
                >Cancel</TButton
              >
              <TButton
                v-if="tab === 'canceled'"
                type="danger"
                @click="update(item.id, { rsvp: 'up', state: 'out' })"
                >RSVP</TButton
              >
              <TButton
                v-if="item.state !== 'in' && tab === 'out'"
                type="danger"
                @click="update(item.id, { rsvp: 'up', state: 'in' })"
                >Check In</TButton
              >
              <TButton
                v-if="tab === 'payment'"
                :type="item.package === 'Subscribed' ? 'success' : 'base'"
                @click="update(item.id, { package: 'Subscribed' })"
                >Subscribed</TButton
              >
              <TButton
                v-if="tab === 'payment'"
                :type="item.package === 'Paid' ? 'success' : 'base'"
                @click="update(item.id, { package: 'Paid' })"
                >Paid</TButton
              >
              <TButton
                v-if="tab === 'payment'"
                :type="!item.package ? 'success' : 'base'"
                @click="update(item.id, { package: '' })"
                >Didn't pay</TButton
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
  setup() {
    const addingGuest = ref(false)
    const { uid, can, account } = useAuth()
    const { params } = useRouter()
    const { getProfile } = useProfiles()
    const { accountFields } = useAccounts()

    const { doc, load, exists, loading } = useDoc('events')
    const { create } = useDoc('emails')
    const { map } = useReactions()
    const selectedParticipants = ref({})

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
          package: item.package,
          partnerId: item.partnerId,
          notes: item.notes,
          notesArray: item.notes ? Object.keys(item.notes) : [],
          couple:
            item.couple || item.withPartner || item.participant.withPartner,
          partnerName: item.participant.partnerName,
          partnerEmail: item.participant.partnerEmail,
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

    const compose = ref(false)

    const selectedParticipantsList = computed(() =>
      Object.keys(selectedParticipants.value).map(
        (i) => selectedParticipants.value[i].name
      )
    )

    const emailFields = [
      {
        name: 'subject'
      },
      {
        name: 'content',
        hideLabel: true,
        type: 'textarea',
        placeholder: 'Your message',
        rows: '5',
        cols: '50'
      }
    ]

    const filters = computed(() => [
      {
        value: '',
        label: 'Registered',
        filter: (item) => item.rsvp === 'up'
      },
      {
        value: 'out',
        label: 'Check in',
        filter: (item) => item.rsvp === 'up' && item.state !== 'in'
      },
      {
        value: 'in',
        label: 'Present',
        filter: (item) => item.rsvp === 'up' && item.state === 'in'
      },
      {
        value: 'payment',
        label: 'Payment',
        filter: (item) => item.rsvp === 'up' && item.state === 'in'
      },
      {
        value: 'couples',
        label: 'Couples',
        filter: (item) =>
          ((!!item.partnerId && item.gender === 'Male') ||
            item.couple === 'Yes') &&
          item.rsvp === 'up'
      },
      {
        value: 'no_couple',
        label: 'No couple',
        filter: (item) =>
          !item.partnerId && item.couple === 'No' && item.rsvp === 'up'
      },
      {
        value: 'canceled',
        label: 'Canceled',
        filter: (item) => item.rsvp === 'down'
      }
    ])

    const sendEmail = (data) => {
      const email = {
        from: `${account.value.name} <${account.value.email}>`,
        subject: data.subject,
        recipients: selectedParticipants.value,
        scheduledAt: new Date(),
        status: 'scheduled',
        content: data.content
      }

      compose.value = false

      create(email)
    }

    const addGuest = async (participant) => {
      if (addingGuest.value && addingGuest.value !== true) {
        const rsvp = await createGuestRsvp(
          params.id,
          'events',
          'up',
          participant,
          { partnerId: addingGuest.value }
        )
        update(addingGuest.value, { partnerId: rsvp.id })
      } else {
        await createGuestRsvp(params.id, 'events', 'up', participant)
      }

      addingGuest.value = false
    }

    const notes = [
      'Steps+',
      'Steps-',
      'Rhythm+',
      'Rhythm-',
      'Turns+',
      'Turns-',
      'NoEnglish',
      'Russian',
      'German',
      'Spanish'
    ]

    const addNote = (item, note) => {
      const notes = item.notes || {}

      if (notes[note]) {
        delete notes[note]
      } else {
        notes[note] = true
      }

      update(item.id, { notes })
    }

    return {
      create,
      compose,
      emailFields,
      sendEmail,
      notes,
      addNote,
      getCandidates,
      addGuest,
      addingGuest,
      filters,
      isCreatingProfile,
      finishReservation,
      account,
      reservationPopup,
      reservationFields,
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
      participants,
      selectedParticipants,
      selectedParticipantsList
    }
  }
}
</script>
