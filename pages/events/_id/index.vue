<template>
  <div>
    <THeader :title="doc.name">
      <TDropdown>
        <TButton
          v-if="can('edit', 'events', doc)"
          type="context"
          icon="people"
          :to="`/events/${doc.id}/dashboard`"
          :label="$t('eventView.dropdown.dashboard')"
        />
        <TButton
          v-if="can('edit', 'events', doc)"
          type="context"
          icon="edit"
          :to="`/events/${doc.id}/edit`"
          :label="$t('eventView.dropdown.edit')"
        />

        <TButton
          v-if="can('edit', 'events', doc)"
          type="context"
          icon="copy"
          :to="`/events/${doc.id}/copy`"
          :label="$t('eventView.dropdown.copy')"
        />
        <TCardActions
          :id="doc.id"
          collection="events"
          :item="doc"
          type="context"
        />
        <TButtonShare
          :id="doc.id"
          collection="events"
          :place="doc.place"
          :file="doc.socialCover"
          :file-name="doc.name"
          :url="`https://wedance.vip/events/${item.id}`"
          :text="doc.name"
          type="context"
          :label="$t('eventView.dropdown.share')"
        />
        <TButton
          v-if="can('edit', 'events', doc)"
          type="context"
          icon="delete"
          label="Delete"
          @click="remove(doc.id)"
        />
      </TDropdown>
    </THeader>

    <div
      class="grid grid-cols-1"
      :class="$route.query.variant ? 'md:grid-cols-2' : ''"
    >
      <div v-if="doc.cover" class="relative">
        <img :src="doc.cover" :alt="doc.name" class="absolute w-full" />
        <div class="square bg-indigo-500"></div>
      </div>

      <div class="md:border-l">
        <div
          class="flex justify-between items-center px-4 py-2 text-xs border-b"
        >
          <TStyles
            :value="doc.styles"
            hide-level
            class="flex flex-wrap justify-left items-center"
          >
            <div v-if="doc.type" class="flex">
              <div class="w-4 text-center">
                {{ getEventIcon(doc.eventType) }}
              </div>
              <div>{{ doc.eventType }}</div>
            </div>
          </TStyles>
          <div>{{ doc.viewsCount || 0 }} views</div>
        </div>

        <a
          v-if="doc.venue"
          :href="doc.venue.url"
          target="_blank"
          class="block border-b py-2 px-4 hover:bg-gray-200"
        >
          <div class="flex items-center justify-start leading-tight">
            <TIcon name="place" class="mr-4 h-4 w-4" />
            <div>
              <h4 class="font-bold">
                {{ doc.venue.name
                }}<span v-if="doc.venue.room"> • {{ doc.venue.room }}</span>
              </h4>
              <div class="text-gray-700">
                {{ doc.venue.formatted_address }}
              </div>
            </div>
          </div>
        </a>

        <div
          v-if="doc.online === 'Yes'"
          class="flex w-full items-center justify-start border-b py-2 px-4 leading-tight"
        >
          <TIcon name="youtube" class="mr-4 h-4 w-4" />
          <div>{{ $t('eventView.online') }}</div>
        </div>

        <div
          class="flex w-full items-center justify-start border-b py-2 px-4 leading-tight"
        >
          <TIcon name="calendar" class="mr-4 h-4 w-4" />
          <div>
            {{ getDateTime(doc.startDate) }} - {{ getDateTime(doc.endDate) }}
          </div>
        </div>

        <div
          class="flex w-full items-center justify-start border-b py-2 px-4 leading-tight"
        >
          <TIcon name="ticket" class="mr-4 h-4 w-4" />
          <div class="flex w-full justify-between">
            <div>{{ doc.price }}</div>
            <template v-if="doc.link">
              <TButton
                v-if="doc.link.includes('https://www.tickettailor.com/')"
                type="link"
                class="text-primary text-sm"
                allow-guests
                @click="ticketTailorPopup = true"
                >Buy Ticket</TButton
              >
              <TButton
                v-else
                type="link"
                class="text-primary text-sm"
                allow-guests
                :href="doc.link"
                target="_blank"
                >Buy Ticket</TButton
              >
            </template>
          </div>
        </div>
      </div>
    </div>

    <TPopup
      v-if="ticketTailorPopup"
      title="Buy Ticket"
      @close="ticketTailorPopup = false"
    >
      <WTicketTailor :href="doc.link" />
    </TPopup>

    <div
      class="sticky bottom-0 z-50 flex justify-center items-center gap-2 border-b bg-white p-4"
    >
      <TReaction
        label="Attend"
        toggled-label="Attending"
        field="star"
        class="rounded-full"
        :item="doc"
      />
      <TButton
        allow-guests
        icon="share"
        type="nav"
        class="rounded-full"
        @click="announcementPopupVisible = true"
      />
    </div>

    <TPopup
      v-if="announcementPopupVisible"
      title="Share"
      @close="announcementPopupVisible = false"
    >
      <div class="w-64 space-y-2 py-4">
        <TButton
          v-if="doc.telegram && doc.telegram.messageUrl"
          allow-guests
          :href="doc.telegram.messageUrl"
          label="Telegram"
          type="nav"
        />
        <TButton
          v-if="doc.instagram && doc.instagram.messageUrl"
          allow-guests
          :href="doc.instagram.messageUrl"
          label="Instagram"
          type="nav"
        />

        <template v-if="can('edit', 'events', doc)">
          <TButton
            v-if="!doc.telegram || !doc.telegram.state"
            label="Promote on Telegram"
            type="nav"
            @click="
              softUpdate(doc.id, {
                telegram: { state: 'requested', requestedAt: +new Date() },
              })
            "
          />
          <TButton
            v-else-if="doc.telegram && doc.telegram.state === 'requested'"
            label="Telegram..."
            type="nav"
          />

          <TButton
            v-if="!doc.instagram || !doc.instagram.state"
            label="Promote on Instagram"
            type="nav"
            @click="
              softUpdate(doc.id, {
                instagram: { state: 'requested', requestedAt: +new Date() },
              })
            "
          />
          <TButton
            v-else-if="doc.instagram && doc.instagram.state === 'requested'"
            label="Instagram..."
            type="nav"
          />
        </template>

        <template v-if="isAdmin()">
          <TButton
            type="nav"
            class="red-500"
            label="Reset Telegram"
            @click="softUpdate(doc.id, { telegram: {} })"
          />
          <TButton
            type="nav"
            class="red-500"
            label="Reset Instagram"
            @click="softUpdate(doc.id, { instagram: {} })"
          />
        </template>
      </div>
    </TPopup>

    <TExpand class="p-4">
      <TPreview :content="doc.description" />
    </TExpand>

    <div v-if="doc.venue && doc.venue.map" class="bg-gray-100 p-4">
      <div class="mb-4 text-sm font-bold leading-none text-gray-700">
        {{ $t('eventView.venueMap') }}
      </div>
      <img :src="doc.venue.map" alt="Venue Map" class="mt-4" />
    </div>

    <TAgenda
      v-if="doc.program"
      :events="doc.program"
      class="w-full space-y-2 p-4"
    />

    <div v-if="doc.org" class="space-y-2 p-4">
      <h4 class="text-xl font-bold">{{ $t('event.organiser') }}</h4>
      <WProfile :username="doc.org.username" :fallback="doc.org" />
    </div>

    <div v-if="doc.artists && doc.artists.length" class="space-y-2 p-4">
      <h3 class="text-xl font-bold">{{ $t('event.artists') }}</h3>
      <div
        v-for="(profile, profileIndex) in doc.artists"
        :key="`artist-${profileIndex}`"
      >
        <WProfile
          v-if="profile"
          :username="profile.username"
          :fallback="profile"
        />
      </div>
    </div>

    <div v-if="doc.star && doc.star.list" class="space-y-2 p-4">
      <h3 class="text-xl font-bold">Guests</h3>
      <div v-for="(val, username) in doc.star.list" :key="`guest-${username}`">
        <WProfile :username="username" />
      </div>
      <div v-if="!doc.star.count">There are no other guests yet.</div>
    </div>

    <div class="m-4 text-xs text-right gap-8">
      <span>Published by {{ creator.username }}</span>
      <span>at {{ getDateTimeYear(doc.createdAt) }}</span>
    </div>

    <div v-if="doc.facebook" class="m-4 text-right text-xs gap-8">
      <a :href="doc.facebook" class="text-gray-700 hover:underline"
        >Facebook Event</a
      >
    </div>

    <TCommentsInline :item="doc" autoload class="border-t p-4" />

    <TPopup v-if="ticketPopup" title="Ticket" @close="ticketPopup = false">
      <div class="mx-auto max-h-screen max-w-md overflow-y-scroll py-4">
        <div>Reserved as {{ getRsvp(item.id).participant.name }}</div>
      </div>
    </TPopup>

    <TPopup
      v-if="reservationPopup"
      title="Get Ticket"
      @close="reservationPopup = false"
    >
      <div class="mx-auto max-h-screen max-w-md overflow-y-scroll py-4">
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
            <h2 class="mb-4 font-bold">
              {{ $t('eventView.reservationPopup.finish.title') }}
            </h2>
            <TButton class="mt-4 mr-4" type="danger" :href="item.link">{{
              $t('eventView.reservationPopup.finish.btn')
            }}</TButton>
          </template>
          <template v-else>
            <h2 class="mb-4 font-bold">
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
import { useEvents } from '~/use/events'
import {
  getDay,
  getDateTimeYear,
  getDateTime,
  getDate,
  getTime,
  dateDiff,
  getEventDescription,
  openURL,
  getDateObect,
  getMeta,
  loadDoc,
} from '~/utils'
import { addressPart } from '~/use/google'
import { trackView } from '~/use/tracking'

export default {
  name: 'EventView',
  layout: 'default',
  async asyncData(ctx) {
    return await loadDoc(ctx, 'posts')
  },
  data: () => ({
    comment: '',
    announcementPopupVisible: false,
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
      return `https://twitter.com/intent/tweet?text=${text} #WeDance ${this.eventUrl}`
    },
  },
  watch: {
    item() {
      if (this.item && this.item.place) {
        this.doc = this.item
        trackView('posts', this.item.id, this.item.viewsCount || 0)
      }
    },
  },
  head() {
    return getMeta('events', this.doc)
  },
  setup() {
    const {
      uid,
      can,
      account,
      updateAccount,
      isAdmin,
      sendSignInLinkToEmail,
    } = useAuth()
    const { getEventIcon } = useEvents()
    const { accountFields } = useAccounts()
    const { params } = useRouter()
    const { getProfile } = useProfiles()
    const { doc, sync, exists, loading, softUpdate, remove } = useDoc('posts')
    const { map } = useReactions()
    const { updateRsvp, createGuestRsvp, getRsvp } = useRsvp()
    if (params.id) {
      sync(params.id)
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
    const ticketPopup = ref(false)
    const reservationPopup = ref(false)
    const ticketTailorPopup = ref(false)
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
      console.log('reserve', participant)
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
      isAdmin,
      softUpdate,
      register,
      isCreatingProfile,
      finishReservation,
      ticketPopup,
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
      getDateTimeYear,
      dateDiff,
      getDate,
      getTime,
      getDay,
      getEventDescription,
      calendarLink,
      getEventIcon,
      getRsvp,
      remove,
      ticketTailorPopup,
    }
  },
}
</script>
