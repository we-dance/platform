<template>
  <div>
    <TItemToolbar collection="events" :item="item" class="mb-2" />

    <TItemCard>
      <TSharePreviewPost
        :username="item.organiser"
        collection="events"
        :title="item.name"
        :type="item.type"
        :description="getEventDescription(item)"
        :extra="item.price"
        :photo="item.cover"
        :styles="item.styles"
        size="sm"
        class="md:-mt-4 md:-mx-4 mb-2"
      />

      <div class="mx-auto max-w-2xl text-center">
        <div class="flex flex-wrap justify-start space-x-2 mt-2">
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

      <TPreview class="mt-4" :content="item.description" />
      <TItemFooter collection="events" :item="item" :title="item.name" />
      <TItemCreator :item="item" />
    </TItemCard>

    <TPopup
      v-if="reservationPopup"
      title="Register"
      @close="reservationPopup = false"
    >
      <div
        class="flex flex-col justify-center max-w-md max-h-screen overflow-y-scroll"
      >
        <div v-if="reservationPopup === 'reserve'">
          <div>
            <div class="text-dark text-sm font-bold my-4 text-left">
              Organiser of the event requires the following information:
            </div>
            <TForm
              v-model="account"
              :fields="reservationFields"
              submit-label="Register"
              class="mt-4 space-y-4"
              @save="reserve"
            >
              <template v-if="!uid" slot="buttons">
                <TButton
                  :to="`/signin?target=${this.$route.fullPath}`"
                  label="Login"
                />
              </template>
            </TForm>
          </div>
        </div>
        <div v-if="reservationPopup === 'finish'" class="p-4">
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
import { useAccounts } from '~/use/accounts'
import useCities from '~/use/cities'
import {
  getDay,
  getDateTime,
  getDate,
  getTime,
  dateDiff,
  getEventDescription
} from '~/utils'

export default {
  name: 'EventView',
  layout: 'default',
  data: () => ({
    comment: ''
  }),
  computed: {
    publishedAt() {
      return getDateTime(this.item?.createdAt)
    },
    creator() {
      return this.getProfile(this.item?.createdBy)
    },
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
      if (this.item && this.item.place) {
        this.currentCity = this.item.place
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
          content: item.socialCover || item.cover,
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

    const reservationFields = accountFields.filter((f) => f.event)

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
      getDay,
      getEventDescription
    }
  }
}
</script>
