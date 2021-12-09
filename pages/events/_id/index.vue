<template>
  <div>
    <THeader :title="item.name">
      <TDropdown>
        <TButton
          v-if="can('edit', 'events', item)"
          type="context"
          icon="people"
          :to="`/events/${item.id}/dashboard`"
          class="hover:text-blue-500 mr-2"
          label="Dashboard"
        />
        <TButton
          v-if="can('edit', 'events', item)"
          type="context"
          icon="edit"
          :to="`/events/${item.id}/edit`"
          class="hover:text-blue-500"
          label="Edit"
        />
        <TCardActions
          :id="item.id"
          collection="events"
          :item="item"
          type="context"
        />
        <TButtonShare
          :id="item.id"
          collection="events"
          :place="item.place"
          :file="item.socialCover"
          :file-name="item.name"
          :url="$route.fullPath"
          :text="item.name"
          type="context"
          label="Share"
        />
      </TDropdown>
    </THeader>

    <div
      class="grid grid-cols-1"
      :class="$route.query.variant ? 'md:grid-cols-2' : ''"
    >
      <div v-if="item.cover" class="relative">
        <img :src="item.cover" :alt="item.name" class="absolute w-full" />
        <div class="square bg-indigo-500"></div>
      </div>

      <div class="md:border-l">
        <div
          v-if="item.type"
          class="flex items-center justify-start w-full leading-tight border-b py-2 px-4"
        >
          <div class="w-4 mr-4 text-center">{{ getEventIcon(item.type) }}</div>
          <div>{{ item.type }}</div>
        </div>

        <TStyles
          :value="item.styles"
          hide-level
          class="flex flex-wrap justify-center border-b text-xs p-2"
        />

        <a
          v-if="item.venue"
          :href="item.venue.url"
          target="_blank"
          class="hover:bg-gray-200 block py-2 px-4 border-b"
        >
          <div class="flex items-center justify-start leading-tight">
            <TIcon name="place" class="w-4 h-4 mr-4" />
            <div>
              <h4 class="font-bold">
                {{ item.venue.name
                }}<span v-if="item.venue.room"> • {{ item.venue.room }}</span>
              </h4>
              <div class="text-gray-700">
                {{ item.venue.formatted_address }}
              </div>
            </div>
          </div>
        </a>

        <div
          v-if="item.online === 'Yes'"
          class="flex items-center justify-start w-full leading-tight border-b py-2 px-4"
        >
          <TIcon name="youtube" class="w-4 h-4 mr-4" />
          <div>Online Event</div>
        </div>

        <div
          class="flex items-center justify-start w-full leading-tight border-b py-2 px-4"
        >
          <TIcon name="calendar" class="w-4 h-4 mr-4" />
          <div>
            {{ getDateTime(item.startDate) }} - {{ getDateTime(item.endDate) }}
          </div>
        </div>

        <div
          class="flex items-center justify-start w-full leading-tight border-b py-2 px-4"
        >
          <TIcon name="ticket" class="w-4 h-4 mr-4" />
          <div>{{ getPrice(item.price) }}</div>
        </div>

        <div
          v-if="item.organiser"
          class="flex items-center justify-start w-full leading-tight border-b py-2 px-4"
        >
          <TIcon name="lobby" class="w-4 h-4 mr-4" />
          <div>Organised by {{ item.organiser }}</div>
        </div>
      </div>
    </div>

    <div
      class="flex mt-4 space-x-2 justify-center sticky bg-white p-4 border-b z-50 top-0"
    >
      <TButton v-if="!uid" type="primary" @click="reservationPopup = 'reserve'"
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

    <TItemCard>
      <TPreview class="mt-4" :content="item.description" />

      <div
        v-if="item.venue && item.venue.map"
        class="p-4 md:-mx-4 md:-mb-4 bg-gray-100"
      >
        <div class="font-bold text-sm mb-4 leading-none text-gray-700">
          Venue Map
        </div>
        <img :src="item.venue.map" alt="Venue Map" class="mt-4" />
      </div>

      <TItemCreator :item="item" full class="mt-4" />

      <div v-if="item.facebook" class="mt-8 text-right text-sm">
        <a :href="item.facebook" class="hover:underline text-gray-700"
          >Event Source</a
        >
      </div>

      <div v-if="item.views" class="text-gray-500 text-sm mt-8">
        {{ item.views }} views
      </div>
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
          <template v-if="item.link">
            <h2 class="font-bold mb-4">Almost there</h2>
            <TButton class="mt-4 mr-4" type="danger" :href="item.link"
              >Complete registration</TButton
            >
          </template>
          <template v-else>
            <h2 class="font-bold mb-4">Almost there</h2>
            <p v-if="uid">
              See you soon! Don't forget to check-in by the organiser when you
              come!
            </p>
            <p v-else>
              Check your email to finish creation of the WeDance profile.
            </p>
            <div v-if="uid">
              <TButton
                :href="calendarLink"
                label="Add to calendar"
                class="mt-2"
              />
            </div>
          </template>
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
import { useEvents } from '~/use/events'
import {
  getDay,
  getDateTime,
  getDate,
  getTime,
  dateDiff,
  getEventDescription,
  openURL,
  getDateObect,
  getPrice,
} from '~/utils'
import { addressPart } from '~/use/google'
import { trackView } from '~/use/tracking'

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
      if (this.item) {
        this.trackView('events', this.item?.id, this.item?.views || 0)
      }

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
    const { getEventIcon } = useEvents()

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
      trackView,
      getEventIcon,
      getPrice,
    }
  },
}
</script>
