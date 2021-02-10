<template>
  <TLoader v-if="loading" />
  <div v-else-if="!exists" class="text-center">
    Event not found
  </div>
  <div v-else>
    <div class="mx-auto max-w-md bg-white p-4">
      <TButtonShare
        :url="`https://wedance.vip/events/${item.id}`"
        :text="item.name"
      />

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
          <span>{{ getDay(item.startDate) }},</span>
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
        <div class="flex flex-wrap justify-center space-x-2 mt-2">
          <div v-if="item.address">
            <div class="flex items-center">
              <TIcon name="place" class="w-4 h-4 mr-1" />
              <a
                :href="`https://maps.google.com/?q=${item.address}`"
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
          <div v-if="item.price">
            <div class="flex items-center">
              <TIcon name="ticket" class="w-4 h-4 mr-1" />
              <p>
                {{ item.price }}
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
            >Register</TButton
          >
          <TButton
            v-else
            class="mt-4 mr-4"
            type="success"
            @click="updateRsvp(item.id, 'events', 'down')"
            >You are registered</TButton
          >
        </div>
      </div>

      <TStyles class="text-center text-xs mt-4" :value="item.styles" />

      <TPreview class="mt-4" :content="item.description" />

      <TShareGenerator
        :id="item.id"
        collection="events"
        :title="item.name"
        :value="item.socialCover"
      />
    </div>

    <div class="mx-auto max-w-md flex justify-end my-4 text-xs pr-4">
      <span class="mr-1">Added by</span>
      <TAvatar :uid="item.createdBy" name />
      <span class="ml-1">on {{ getDateTime(item.createdAt) }}</span>
    </div>

    <TPopup
      v-if="reservationPopup"
      title="Register"
      @close="reservationPopup = false"
    >
      <div
        class="mt-4 flex flex-col justify-center max-h-screen overflow-y-scroll"
      >
        <div v-if="reservationPopup === 'reserve'">
          <div>
            <p>
              Organiser of the event requires the following information:
            </p>
            <TForm
              v-model="account"
              :fields="reservationFields"
              submit-label="Submit"
              class="mt-4"
              @save="reserve"
            />
          </div>
          <div v-if="!uid" class="mt-4 pt-4 border-t">
            <h2 class="text-center text-base">
              Do you already have WeDance account?
              <router-link
                :to="`/signin?target=${this.$route.fullPath}`"
                class="underline hover:no-underline fon"
                >Log In</router-link
              >
            </h2>
          </div>
        </div>
        <div v-if="reservationPopup === 'finish'">
          <h2 class="font-bold mb-4">Your spot is reserved</h2>
          <p v-if="uid">
            See you soon! Don't forget to check-in by the organiser when you
            come!
          </p>
          <p v-else>
            Check your email to finish creation of the WeDance profile.
          </p>
          <TButton type="primary" class="mt-4" @click="reservationPopup = false"
            >Finish</TButton
          >
        </div>
      </div>
    </TPopup>
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
import useCities from '~/use/cities'
import { getDay, getDateTime, getDate, getTime, dateDiff } from '~/utils'

export default {
  layout: 'default',
  data: () => ({
    comment: ''
  }),
  computed: {
    eventUrl() {
      const app = process.env.app
      const url = app.url + this.$route.fullPath

      return url
    },
    tweetUrl() {
      const text = encodeURI(`"${this.item.name}"`)

      return `https://twitter.com/intent/tweet?text=${text} %23WeDance ${this.eventUrl}`
    }
  },
  watch: {
    item() {
      if (this.item && this.item.city) {
        this.currentCity = this.item.city
      }
    }
  },
  head() {
    if (!this.item) {
      return {}
    }

    const item = this.item

    return {
      title: item.name,
      canonical: this.eventUrl,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: item.excerpt
        },
        {
          hid: 'author',
          name: 'author',
          content: item.organiser
        },
        {
          hid: 'publisher',
          name: 'publisher',
          content: item.createdBy
        },
        {
          name: 'keywords',
          content: item.keywords,
          hid: 'keywords'
        },
        {
          property: 'og:image',
          content: item.cover,
          hid: 'og:image'
        },
        {
          property: 'og:type',
          content: 'event',
          hid: 'og:type'
        },
        {
          property: 'og:title',
          content: item.name,
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
    const {
      uid,
      can,
      account,
      updateAccount,
      sendSignInLinkToEmail
    } = useAuth()
    const { currentCity } = useCities()

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

    const reservationFields = [
      ...accountFields,
      {
        name: 'withPartner',
        type: 'select',
        label: 'Do you have a partner?',
        options: ['Yes', 'No']
      },
      {
        name: 'partnerName',
        label: "Partner's name",
        when: (answers) => answers.withPartner === 'Yes'
      },
      {
        name: 'partnerEmail',
        label: "Partner's email",
        when: (answers) => answers.withPartner === 'Yes'
      }
    ]

    const reservationPopup = ref(false)
    const isCreatingProfile = ref(false)

    const finishReservation = () => {
      reservationPopup.value = false
    }

    const reserve = async (participant) => {
      if (!uid.value) {
        await createGuestRsvp(params.id, 'events', 'up', participant)
        sendSignInLinkToEmail(participant.email)
      } else {
        await updateAccount(participant)
        updateRsvp(params.id, 'events', 'up')
      }

      reservationPopup.value = 'finish'
    }

    return {
      currentCity,
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
      getDay
    }
  }
}
</script>
