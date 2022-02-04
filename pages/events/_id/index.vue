<template>
  <div>
    <THeader :title="item.name">
      <TDropdown>
        <TButton
          v-if="can('edit', 'events', item)"
          type="context"
          icon="people"
          :to="`/events/${item.id}/dashboard`"
          :label="$t('eventView.dropdown.dashboard')"
        />
        <TButton
          v-if="can('edit', 'events', item)"
          type="context"
          icon="edit"
          :to="`/events/${item.id}/edit`"
          :label="$t('eventView.dropdown.edit')"
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
          :label="$t('eventView.dropdown.share')"
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
          <div class="w-4 mr-4 text-center">
            {{ getEventIcon(item.eventType) }}
          </div>
          <div>{{ item.eventType }}</div>
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
          <div>{{ $t('eventView.online') }}</div>
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
          <div>{{ $n(item.price, 'currency') }}</div>
        </div>

        <div
          v-if="item.organiser"
          class="flex items-center justify-start w-full leading-tight border-b py-2 px-4"
        >
          <TIcon name="lobby" class="w-4 h-4 mr-4" />
          <div>{{ $t('eventView.organiser') }} {{ item.organiser }}</div>
        </div>
      </div>
    </div>

    <div
      class="flex mt-4 space-x-2 justify-center sticky bg-white p-4 border-b z-50 top-0"
    >
      <TButton
        v-if="item.response !== 'up'"
        type="primary"
        :title="$t('eventView.reservation.guest')"
        @click="reservationPopup = 'reserve'"
        >{{ $t('eventView.reservation.guest') }}</TButton
      >
      <TButton
        v-if="uid && item.response === 'up'"
        type="secondary"
        @click="updateRsvp(item.id, 'events', 'down')"
        >{{ $t('eventView.reservation.cancel') }}</TButton
      >
    </div>

    <TPreview :content="item.description" class="p-4" />

    <div v-if="item.artists" class="space-y-2 p-4">
      <h3 class="text-xl font-bold">{{ $t('event.artists') }}</h3>
      <WProfile
        v-for="profile in item.artists"
        :key="profile.username"
        :username="profile.username"
        :fallback="profile"
      />
    </div>

    <div v-if="item.venue && item.venue.map" class="p-4 bg-gray-100">
      <div class="font-bold text-sm mb-4 leading-none text-gray-700">
        {{ $t('eventView.venueMap') }}
      </div>
      <img :src="item.venue.map" alt="Venue Map" class="mt-4" />
    </div>

    <div v-if="item.org" class="space-y-2 p-4">
      <h4 class="text-xl font-bold">{{ $t('event.organiser') }}</h4>
      <WProfile :username="item.org.username" :fallback="item.org" full />
    </div>

    <div v-if="item.facebook" class="mt-8 text-right text-sm">
      <a :href="item.facebook" class="hover:underline text-gray-700">{{
        $t('eventView.source')
      }}</a>
    </div>

    <TCommentsInline :item="item" autoload class="border-t p-4" />

    <TPopup
      v-if="reservationPopup"
      :title="$t('eventView.reservationPopup.title')"
      @close="reservationPopup = false"
    >
      <div class="max-w-md mx-auto py-4 max-h-screen overflow-y-scroll">
        <div v-if="reservationPopup === 'reserve'">
          <div>
            <TForm
              v-model="account"
              allow-guests
              :fields="reservationFields"
              :submit-label="
                $t('eventView.reservationPopup.reserve.submitLabel')
              "
              class="mt-4 space-y-4"
              @save="reserve"
            >
              <template v-if="!uid" slot="buttons">
                <TButton
                  allow-guests
                  :to="`/signin?target=${this.$route.fullPath}`"
                  :label="$t('eventView.reservationPopup.reserve.label')"
                />
              </template>
            </TForm>
          </div>
        </div>
        <div v-if="reservationPopup === 'finish'" class="p-4">
          <template v-if="item.link">
            <h2 class="font-bold mb-4">
              {{ $t('eventView.reservationPopup.finish.title') }}
            </h2>
            <TButton class="mt-4 mr-4" type="danger" :href="item.link">{{
              $t('eventView.reservationPopup.finish.btn')
            }}</TButton>
          </template>
          <template v-else>
            <h2 class="font-bold mb-4">
              {{ $t('eventView.reservationPopup.finish.title') }}
            </h2>
            <p v-if="uid">
              {{ $t('eventView.reservationPopup.finish.description') }}
            </p>
            <p v-else>
              {{ $t('eventView.reservationPopup.finish.reminder') }}
            </p>
            <div v-if="uid">
              <TButton
                :href="calendarLink"
                :label="$t('eventView.reservationPopup.finish.calendar')"
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
import { useAccounts } from '~/use/accounts'
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
    const { getEventIcon } = useEvents()
    const { currentCity } = useCities()
    const { accountFields } = useAccounts()

    const { params } = useRouter()
    const { getProfile } = useProfiles()

    const { doc, load, exists, loading } = useDoc('posts')
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
        updateRsvp(id, 'posts', 'up')
      }

      openURL(link)
    }

    const reserve = async (participant) => {
      if (!uid.value) {
        await createGuestRsvp(params.id, 'posts', 'up', participant)
        sendSignInLinkToEmail(participant.email)
      } else {
        await updateAccount(participant)
        updateRsvp(params.id, 'posts', 'up')
      }

      reservationPopup.value = 'finish'

      if (item.value.link) {
        openURL(item.value.link)
      }
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
      getEventIcon,
    }
  },
}
</script>
