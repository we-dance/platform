<template>
  <div>
    <THeader :title="doc.name">
      <TDropdown>
        <TButton type="context" icon="add" :href="calendarLink" label="GCal" />
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
          class="flex flex-wrap justify-start items-center px-4 py-2 space-x-1 text-xs border-b"
        >
          <div v-if="reviewsCount" class="flex">
            <TIcon class="h-4 w-4" name="star" />
            <span>{{ reviewsAvg }} ({{ reviewsCount }})</span>
          </div>
          <div v-if="reviewsCount">·</div>
          <div>
            {{ $tc('guests', guestCount, { count: guestCount }) }}
          </div>
          <div>·</div>
          <div>
            {{ $tc('views', doc.viewsCount, { count: doc.viewsCount }) }}
          </div>
          <div>·</div>
          <div>{{ getEventTypeLabel(doc.eventType) }}</div>
          <div>·</div>
          <div>
            {{
              getStyles(doc.styles, 0, false, 3)
                .map((s) => s.name)
                .join(' · ')
            }}
          </div>
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
            {{ getDateTime(doc.startDate, $i18n.locale) }} -
            {{ getDateTime(doc.endDate, $i18n.locale) }}
          </div>
        </div>

        <div
          class="flex w-full items-center justify-start border-b py-2 px-4 leading-tight"
        >
          <TIcon name="ticket" class="mr-4 h-4 w-4" />
          <div class="flex w-full justify-between">
            <div>{{ doc.price }}</div>
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

    <div v-if="!isGoing" class="text-xs p-4 text-center font-bold">
      {{ $t('event.attendCallToAction') }}
    </div>
    <div
      class="sticky bottom-0 z-50 flex justify-center items-center gap-2 border-b bg-white p-4"
    >
      <TReaction
        type="primary"
        toggled-class="bg-green-500 hover:bg-green-800"
        :label="$t('event.attend')"
        :toggled-label="$t('event.attending')"
        icon="PlusIcon"
        toggled-icon="CheckIcon"
        field="star"
        class="rounded-full text-dark"
        hide-count
        :item="doc"
      />
      <TButton
        allow-guests
        icon="share"
        :label="$t('event.share')"
        class="rounded-full"
        @click="announcementPopupVisible = true"
      />
    </div>

    <div v-if="isGoing" class="border-b bg-white p-4">
      <TPreview v-if="doc.confirmation" :content="doc.confirmation" />

      <div class="flex flex-col md:flex-row justify-center items-center gap-2">
        <template v-if="doc.link">
          <TButton
            v-if="doc.link.includes('https://www.tickettailor.com/')"
            icon="ticket"
            type="primary"
            :label="$t('event.getTicket')"
            @click="ticketTailorPopup = true"
          />
          <TButton
            v-else
            type="primary"
            icon="ticket"
            :href="doc.link"
            target="_blank"
            :label="$t('event.getTicket')"
          />
        </template>
        <TButton
          v-if="doc.gallery"
          icon="spotlight"
          :href="doc.gallery"
          :label="$t('event.gallery.action')"
        />
        <TButton
          v-if="doc.playlist"
          icon="spotify"
          :href="doc.playlist"
          :label="$t('event.playlist.action')"
        />
        <TButton
          v-if="doc.paypal"
          icon="favorite"
          :href="doc.paypal"
          :label="$t('event.paypal.action')"
        />
        <TButton
          v-if="doc.review"
          icon="chat"
          :href="doc.review"
          :label="$t('event.review.action')"
        />
      </div>
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
      <h3 class="text-xl font-bold">{{ $t('event.guests') }}</h3>
      <div
        v-if="guests.followersCount || guests.leadersCount"
        class="text-xs pt-0"
      >
        <span>{{
          $tc('followersCount', guests.followersCount, {
            count: guests.followersCount,
          })
        }}</span>
        <span>·</span>
        <span>{{
          $tc('leadersCount', guests.leadersCount, {
            count: guests.leadersCount,
          })
        }}</span>
      </div>
      <div v-if="!uid" class="flex justify-center p-4">
        <TButton
          type="link"
          allow-guests
          :to="`/signin?target=${$route.path}`"
          >{{ $t('event.guestsHidden') }}</TButton
        >
      </div>
      <div v-else>
        <div
          v-for="(val, username) in doc.star.list"
          :key="`guest-${username}`"
        >
          <WProfile :username="username" />
        </div>
        <div v-if="!doc.star.count">There are no other guests yet.</div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-bold p-4 border-t">{{ $t('comments.label') }}</h3>
      <div v-if="!uid" class="flex justify-center p-4">
        <TButton
          type="link"
          allow-guests
          :to="`/signin?target=${$route.path}`"
          >{{ $t('event.commentsHidden') }}</TButton
        >
      </div>

      <TCommentsInline v-else :item="doc" autoload class="px-4" />
    </div>

    <div>
      <h3 class="text-xl font-bold p-4 border-t">{{ $t('reviews.title') }}</h3>
      <TReviewList :reviews="reviews" class="px-4" />
    </div>

    <div class="m-4 text-xs text-right gap-8">
      <span>Published by {{ creator.username }}</span>
      <span>at {{ getDateTimeYear(doc.createdAt, $i18n.locale) }}</span>
    </div>

    <div v-if="doc.facebook" class="m-4 text-right text-xs gap-8">
      <a :href="doc.facebook" class="text-gray-700 hover:underline"
        >Facebook Event</a
      >
    </div>
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
import { computed, ref, watch } from '@nuxtjs/composition-api'
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
import { useStyles } from '~/use/styles'

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
    guestCount() {
      const guestsCount = this.doc.star?.count || 0
      const artistsCount = this.doc.artists?.length || 0

      return guestsCount + artistsCount + 1
    },
    publishedAt() {
      return getDateTime(this.item?.createdAt)
    },
    creator() {
      return this.getProfile(this.item?.createdBy)
    },
    org() {
      return this.getFullProfile(this.item?.org?.id)
    },
    reviews() {
      return this.org?.reviews || []
    },
    reviewsAvg() {
      if (!this.reviewsCount) {
        return 0
      }

      return (
        this.reviews.map((r) => Number(r.stars)).reduce((p, c) => p + c, 0) /
        this.reviewsCount
      )
    },
    reviewsCount() {
      return this.reviews.length || 0
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
      username,
      isAdmin,
      sendSignInLinkToEmail,
    } = useAuth()
    const { getEventIcon, getEventTypeLabel } = useEvents()
    const { accountFields } = useAccounts()
    const { params } = useRouter()
    const { getProfile, getFullProfile } = useProfiles()
    const { doc, sync, exists, loading, softUpdate, remove } = useDoc('posts')
    const { find: findProfile } = useDoc('profiles')
    const { map } = useReactions()
    const { updateRsvp, createGuestRsvp, getRsvp } = useRsvp()
    if (params.id) {
      sync(params.id)
    }
    const { getStyles } = useStyles()
    const item = computed(() => {
      const result = map(doc.value)
      result.locality = addressPart(result.venue, 'locality')
      return result
    })

    const profileCache = {}
    const guests = ref({})

    async function getCachedProfile(username) {
      if (!profileCache[username]) {
        profileCache[username] = await findProfile('username', username)
      }

      return profileCache[username]
    }

    watch(doc, async () => {
      const list = doc.value.star?.list

      const result = {
        list: [],
        followersCount: 0,
        leadersCount: 0,
      }

      if (!list) {
        guests.value = result

        return
      }

      if (guests.value?.list?.length) {
        return
      }

      for (const guestUsername of Object.keys(list)) {
        const guestProfile = await getCachedProfile(guestUsername)

        result.list.push(guestProfile)
        if (guestProfile.gender === 'Female') {
          result.followersCount++
        } else {
          result.leadersCount++
        }
      }

      guests.value = result
    })

    const isGoing = computed(() => {
      return (
        doc.value.star?.list &&
        username.value &&
        doc.value.star.list[username.value]
      )
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
      isGoing,
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
      guests,
      uid,
      loading,
      item,
      map,
      updateRsvp,
      can,
      getProfile,
      getFullProfile,
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
      getEventTypeLabel,
      getStyles,
    }
  },
}
</script>
