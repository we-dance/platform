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
    <div class="mx-auto max-w-md bg-real-white p-4">
      <div class="mb-2 flex items-start justify-end">
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
        <TGridParticipants :items="participants" />
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
import { getDateTime, getDate, getTime, dateDiff } from '~/utils'

export default {
  layout: 'public',
  setup() {
    const { uid, can, account, updateAccount } = useAuth()
    const { params } = useRouter()
    const { getProfile } = useProfiles()
    const { accountFields } = useAccounts()

    const { doc, load, exists, loading } = useDoc('events')
    const { map } = useReactions()

    const { updateRsvp, createGuestRsvp, getListRsvps } = useRSVP()

    if (params.id) {
      load(params.id)
    }

    const participants = computed(() =>
      getListRsvps(params.id, 'up').map((item) => ({
        name: item.participant.name,
        email: item.participant.email,
        phone: item.participant.phone,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        id: item.createdBy
      }))
    )

    const item = computed(() => map(doc.value))

    const reservationFields = accountFields

    const reservationPopup = ref(false)
    const isCreatingProfile = ref(false)

    const finishReservation = () => {
      reservationPopup.value = false
    }

    const reserve = async (participant) => {
      if (!uid.value) {
        createGuestRsvp(params.id, 'events', 'up', participant)
      } else {
        await updateAccount(participant)
        updateRsvp(params.id, 'events', 'up')
      }

      reservationPopup.value = 'finish'
    }

    return {
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
