<template>
  <div>
    <THeader :title="item.name">
      <TDropdown v-if="can('edit', 'events', item)">
        <TButton
          type="context"
          icon="people"
          :to="`/events/${item.id}/dashboard`"
          class="hover:text-blue-500 mr-2"
          label="Dashboard"
        />
        <TButton
          type="context"
          icon="edit"
          :to="`/events/${item.id}/edit`"
          class="hover:text-blue-500"
          label="Edit"
        />
      </TDropdown>
    </THeader>

    <TItemCard>
      <TSharePreviewPost
        :username="creator.username"
        collection="events"
        :title="item.name"
        :type="item.type"
        :description="getEventDescription(item)"
        :extra="item.locality"
        :photo="item.cover"
        :styles="item.styles"
        size="sm"
        class="md:-mt-4 md:-mx-4 mb-2"
      />

      <div class="mx-auto max-w-2xl text-center">
        <div class="flex flex-wrap justify-start space-x-2 mt-2">
          <div v-if="item.venue">
            <div class="flex items-center">
              <TIcon name="place" class="w-4 h-4 mr-1" />
              <div>
                <a
                  :href="item.venue.url"
                  class="underline hover:no-underline"
                  target="_blank"
                >
                  {{ item.venue.name }}</a
                ><span v-if="item.venue.room"> • {{ item.venue.room }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="item.address">
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
        <div class="text-left">Price: {{ item.price }}</div>
        <div>
          <template v-if="item.link">
            <TButton
              class="mt-4 mr-4"
              type="danger"
              @click="register(item.id, item.link)"
              >Register</TButton
            >
          </template>
          <template v-else>
            <div class="flex mt-4 space-x-2 justify-center">
              <TButton
                v-if="!uid"
                type="primary"
                @click="reservationPopup = 'reserve'"
                >Register for event</TButton
              >
              <TButton
                v-else
                :type="uid && item.response === 'up' ? 'success' : 'secondary'"
                @click="reservationPopup = 'reserve'"
                >Going</TButton
              >
              <TButton
                v-if="uid"
                :type="uid && item.response === 'down' ? 'danger' : 'secondary'"
                @click="updateRsvp(item.id, 'events', 'down')"
                >Not going</TButton
              >
            </div>
          </template>
        </div>
      </div>

      <TPreview class="mt-4" :content="item.description" />
      <TItemFooter collection="events" :item="item" :title="item.name" />

      <div
        v-if="item.venue && item.venue.map"
        class="p-4 md:-mx-4 md:-mb-4 bg-gray-100"
      >
        <div class="font-bold text-sm mb-4 leading-none text-gray-700">
          Venue Map
        </div>
        <img :src="item.venue.map" alt="Venue Map" class="mt-4" />
      </div>

      <TItemCreator :item="item" />
    </TItemCard>

    <TPopup
      v-if="reservationPopup"
      title="Register"
      @close="reservationPopup = false"
    >
      <div class="max-w-md mx-auto py-4 max-h-screen overflow-y-scroll">
        <div v-if="reservationPopup === 'reserve'">
          <div>
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
          <div>
            <TButton
              :href="calendarLink"
              label="Add to calendar"
              class="mt-2"
            />
          </div>
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import googleCalendarEventUrl from 'generate-google-calendar-url'
import { computed, ref } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRsvp } from '~/use/rsvp'
import { useRouter } from '~/use/router'
import { useProfiles } from '~/use/profiles'
import { useReactions } from '~/use/reactions'
import { accountFields } from '~/use/accounts'
import { useCities } from '~/use/cities'
import {
  getDay,
  getDateTime,
  getDate,
  getTime,
  dateDiff,
  getEventDescription,
  openURL,
  getDateObect,
} from '~/utils'
import { addressPart } from '~/use/google'

export default {
  name: 'EventView',
  layout: 'default',
  data: () => ({
    comment: '',
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
    },
  },
  watch: {
    item() {
      if (this.item && this.item.place) {
        this.currentCity = this.item.place
      }
    },
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
          content: item.excerpt,
        },
        {
          hid: 'author',
          name: 'author',
          content: this.creator.username,
        },
        {
          hid: 'publisher',
          name: 'publisher',
          content: this.creator.username,
        },
        {
          name: 'keywords',
          content: item.keywords,
          hid: 'keywords',
        },
        {
          property: 'og:image',
          content: item.socialCover || item.cover,
          hid: 'og:image',
        },
        {
          property: 'og:type',
          content: 'event',
          hid: 'og:type',
        },
        {
          property: 'og:title',
          content: item.name,
          hid: 'og:title',
        },
        {
          property: 'og:description',
          content: item.excerpt,
          hid: 'og:description',
        },
      ],
    }
  },
  setup() {
    const {
      uid,
      can,
      account,
      updateAccount,
      sendSignInLinkToEmail,
    } = useAuth()
    const { currentCity } = useCities()

    const { params } = useRouter()
    const { getProfile } = useProfiles()

    const { doc, load, exists, loading } = useDoc('events')
    const { map } = useReactions()

    const { updateRsvp, createGuestRsvp } = useRsvp()

    if (params.id) {
      load(params.id)
    }

    const item = computed(() => {
      const result = map(doc.value)
      result.locality = addressPart(result.venue, 'locality')

      return result
    })

    const calendarLink = computed(() =>
      googleCalendarEventUrl({
        start: getDateObect(item.value?.startDate),
        end: getDateObect(item.value?.endDate),
        title: item.value?.name,
        details: `https://wedance.vip/events/${item.value?.id}`,
        location: item.value?.address,
      })
    )

    const reservationFields = accountFields.filter((f) => f.event)

    const reservationPopup = ref(false)
    const isCreatingProfile = ref(false)

    const finishReservation = () => {
      reservationPopup.value = false
    }

    function register(id, link) {
      if (uid.value) {
        updateRsvp(id, 'events', 'up')
      }

      openURL(link)
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
      register,
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
      getEventDescription,
      calendarLink,
    }
  },
}
</script>
