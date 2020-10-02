<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Event not found
  </div>
  <div v-else>
    <TPopup
      v-if="reservationPopup && !uid"
      title="Members only"
      @close="reservationPopup = false"
    >
      <div class="mt-4 flex flex-col justify-center">
        <div>Sign in to participate in events</div>
        <TButton
          type="primary"
          class="mt-2"
          :to="`/signin?target=${this.$route.fullPath}`"
          >Sign In</TButton
        >
      </div>
    </TPopup>
    <TPopup
      v-if="reservationPopup && uid"
      title="Reserve a spot"
      @close="reservationPopup = false"
    >
      <div class="my-4 flex flex-col justify-center max-w-sm w-full">
        <div v-if="reservationPopup === 'reserve'">
          <div>
            <p class="text-xs">
              Organiser of the event requires the following information:
            </p>
            <TForm
              v-model="account"
              :fields="reservationFields"
              submit-label="Reserve"
              class="mt-4"
              @save="reserve"
            />
          </div>
        </div>
        <div v-if="reservationPopup === 'finish'">
          <h2 class="font-bold mb-4">Your spot is reserved</h2>
          <p>
            See you soon! Don't forget to check-in by the organiser when you
            come!
          </p>
          <TButton type="primary" class="mt-4" @click="reservationPopup = false"
            >Finish</TButton
          >
        </div>
      </div>
    </TPopup>

    <div class="mx-auto max-w-md bg-real-white p-4">
      <div
        v-if="can('edit', 'events', item)"
        class="mb-2 flex items-start justify-center"
      >
        <TButton
          icon="people"
          :to="`/events/${item.id}/dashboard`"
          class="hover:text-blue-500 mr-2"
          label="Dashboard"
        />
        <TButton
          icon="edit"
          :to="`/events/${item.id}/edit`"
          class="hover:text-blue-500"
          label="Edit"
        />
      </div>

      <img v-if="item.cover" :src="item.cover" :alt="item.name" class="mb-2" />
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
        <div class="flex flex-wrap justify-center mt-2">
          <div v-if="item.address" class="mr-2">
            <div class="flex items-center">
              <TIcon name="place" class="w-4 h-4 mr-1" />
              <a
                :href="
                  `https://maps.google.com/?q=${item.address},${item.city}`
                "
                class="underline hover:no-underline"
                target="_blank"
              >
                {{ item.address }}
              </a>
            </div>
          </div>
          <div v-if="item.organiser">
            <div class="flex items-center">
              <TIcon name="store" class="w-4 h-4 mr-1" />
              <p>
                {{ item.organiser }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <TButton
            v-if="item.link"
            class="mt-4 mr-4"
            type="danger"
            :href="item.link"
            >Register</TButton
          >
          <TButton
            v-else-if="!uid || item.response !== 'up'"
            class="mt-4 mr-4"
            type="danger"
            @click="reservationPopup = 'reserve'"
            >Reserve a spot</TButton
          >
          <TButton
            v-else
            class="mt-4 mr-4"
            type="success"
            @click="updateRsvp(item.id, 'events', 'down')"
            >You are going</TButton
          >
        </div>
      </div>

      <TStyles class="text-center text-xs mt-4" :value="item.styles" />

      <TPreview class="mt-4" :content="item.description" />
    </div>

    <div class="mx-auto max-w-md flex justify-end my-4 text-xs pr-4">
      <span class="mr-1">Added by</span>
      <TAvatar :uid="item.createdBy" name />
      <span class="ml-1">on {{ getDateTime(item.createdAt) }}</span>
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
  data: () => ({
    comment: ''
  }),
  computed: {
    tweetUrl() {
      const app = process.env.app

      const url = app.url + this.$route.fullPath

      const text = encodeURI(`"${this.item.name}"`)

      return `https://twitter.com/intent/tweet?text=${text} %23WeDance ${url}`
    }
  },
  head() {
    if (!this.item) {
      return {}
    }

    const item = this.item

    return {
      title: item.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: item.excerpt
        },
        {
          name: 'keywords',
          content: item.keywords,
          hid: 'keywords'
        },
        {
          property: 'og:title',
          content: item.title,
          hid: 'og:title'
        },
        {
          property: 'og:description',
          content: item.excerpt,
          hid: 'og:description'
        }
      ]
    }
  },
  setup() {
    const { uid, can, account, updateAccount } = useAuth()
    const { params } = useRouter()
    const { getProfile } = useProfiles()
    const { accountFields } = useAccounts()

    const { doc, load, exists, loading } = useDoc('events')
    const { map } = useReactions()

    const { updateRsvp, createGuestRsvp } = useRSVP()

    if (params.id) {
      load(params.id)
    }

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
      getTime
    }
  }
}
</script>
