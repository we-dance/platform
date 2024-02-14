<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="p-4 flex gap-2 border-b">
      <div class="text-center pt-2">
        <div class="text-xl font-bold leading-none text-primary">
          {{ formatDate(doc.startDate, 'd') }}
        </div>
        <div class="w-12 text-sm">
          {{ formatDate(doc.startDate, 'MMM') }}
        </div>
        <div class="w-12 text-xs">
          {{ formatDate(doc.startDate, 'yyyy') }}
        </div>
      </div>
      <div>
        <div class="flex gap-1 text-xs uppercase">
          <div class="text-primary">{{ getEventTypeLabel(doc.eventType) }}</div>
          <div>·</div>
          <div>
            {{
              getStyles(doc.styles, 0, false, 3)
                .map((s) => s.name)
                .join(' · ')
            }}
          </div>
        </div>
        <h1 class="text-2xl font-bold leading-none">{{ doc.name }}</h1>
        <div class="mt-1 flex gap-1 text-xs">
          <div>
            {{ formatDate(doc.startDate, 'iii') }}
          </div>
          <div>
            {{ formatDate(doc.startDate, 'HH:mm') }}
            <span v-if="doc.endDate">
              &mdash; {{ formatDate(doc.endDate, 'HH:mm') }}</span
            >
          </div>
          <div>·</div>
          <div>
            {{ $tc('guests', guestCount, { count: guestCount }) }}
          </div>
          <div>·</div>
          <div>
            {{ $tc('views', doc.viewsCount, { count: doc.viewsCount }) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isGoing" class="text-xs p-4 pb-0 text-center font-bold">
      {{ $t('event.attendCallToAction') }}
    </div>
    <div
      class="sticky top-0 z-40 flex flex-wrap justify-center items-center gap-2 bg-white p-4 shadow"
    >
      <TReaction
        type="primary"
        toggled-class="bg-green-500 hover:bg-green-800"
        :label="$t('event.attend')"
        :toggled-label="$t('event.attending')"
        icon="PlusIcon"
        toggled-icon="CheckIcon"
        field="star"
        class="rounded-full"
        hide-count
        :item="doc"
      />
      <TEventBookmark
        :event-id="doc.id"
        show-label
        type="secondary"
        label="Bookmark"
        toggled-label="Bookmarked"
        size="4"
      />
      <TButtonShare
        :id="doc.id"
        collection="events"
        :doc="doc"
        :place="doc.place"
        :file="doc.socialCover"
        :file-name="doc.name"
        :url="`https://wedance.vip/events/${item.id}`"
        :text="doc.name"
        type="simple"
        class="rounded-full"
        :label="$t('eventView.dropdown.share')"
      />
    </div>

    <div
      class="grid grid-cols-1"
      :class="$route.query.variant ? 'md:grid-cols-2' : ''"
    >
      <div class="md:border-l">
        <div
          v-if="$route.query.as !== 'guest' && can('edit', 'events', doc)"
          class="space-y-2 p-4 border-b bg-orange-100"
        >
          <h3 class="text-xs font-bold uppercase">Moderator Tools</h3>
          <div class="flex flex-wrap gap-2">
            <TButton
              type="secondary"
              icon="people"
              :to="localePath(`/events/${doc.id}/dashboard`)"
              :label="$t('eventView.dropdown.dashboard')"
            />

            <TButton
              type="secondary"
              icon="edit"
              :to="localePath(`/events/${doc.id}/edit`)"
              :label="$t('eventView.dropdown.edit')"
            />

            <TButton
              type="secondary"
              icon="copy"
              :to="localePath(`/events/${doc.id}/copy`)"
              :label="$t('eventView.dropdown.copy')"
            />

            <TButton
              v-if="can('edit', 'events', doc)"
              type="secondary"
              icon="delete"
              label="Delete"
              @click="deleteEvent(doc.id)"
            />

            <TButton
              type="secondary"
              :to="localePath(`/events/${doc.id}?as=guest`)"
              label="Preview as guest"
            />
          </div>
          <div v-if="doc.promotion !== 'completed'" class="text-sm">
            As soon as event is published, you can promote it for free on
            WeDance Instagram by clicking Promote.
            <div v-if="doc.promotion === 'failed'">
              <div class="text-red-500">
                Promotion failed: {{ doc.promotionError }}
              </div>
              <div>
                Please
                <a
                  class="underline text-primary"
                  href="mailto:support@wedance.vip"
                  >contact support</a
                >
                to resolve the issue.
              </div>
            </div>
          </div>

          <TButton
            v-if="!doc.socialCover"
            label="Publishing..."
            class="rounded-full"
          />
          <TButton
            v-else-if="doc.promotion === 'requested'"
            label="Promoting..."
            class="rounded-full"
          />
          <div v-else-if="doc.promotion === 'completed'" class="text-sm">
            Event announcement is published on
            <a class="underline text-primary" :href="doc.instagram.messageUrl"
              >Instagram</a
            >
          </div>
          <TButton
            v-else
            icon="trending"
            label="Promote"
            class="rounded-full"
            @click="
              softUpdate(doc.id, {
                promotion: 'requested',
              })
            "
          />
          <TButton
            v-if="isAdmin() && doc.promotion === 'completed'"
            label="Reset"
            class="rounded-full"
            @click="
              softUpdate(doc.id, {
                promotion: '',
              })
            "
          />
        </div>

        <div v-if="doc.org" class="border-b">
          <WProfile
            :username="doc.org.username"
            :fallback="doc.org"
            hide-role
            class="border-none"
          />
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
          v-if="doc.price"
          class="flex w-full items-center justify-start border-b py-2 px-4 leading-tight"
        >
          <TIcon name="ticket" class="mr-4 h-4 w-4" />
          <div class="flex w-full justify-between">
            <div>{{ doc.price }}</div>
          </div>
        </div>

        <div
          v-if="doc.specialOffer"
          class="flex w-full items-center justify-start border-b py-2 px-4 leading-tight"
        >
          <TIcon name="fire" class="mr-4 h-4 w-4 text-primary" />
          <div class="flex w-full justify-between text-primary">
            <div>{{ doc.specialOffer }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="doc.type === 'import_error'"
      class="flex flex-col justify-center items-center h-64 p-4 text-center"
    >
      <div class="text-sm text-red-500">{{ doc.error }}</div>
      <TButton
        v-if="can('edit', 'events', doc)"
        type="primary"
        icon="delete"
        label="Delete Event"
        class="mt-4"
        @click="deleteEvent(doc.id)"
      />
    </div>
    <div
      v-else-if="doc.type === 'import_event'"
      class="flex justify-center items-center h-64"
    >
      <div class="text-sm">Importing event from Facebook...</div>
    </div>
    <div v-else>
      <TPopup
        v-if="ticketTailorPopup"
        title="Buy Ticket"
        @close="ticketTailorPopup = false"
      >
        <WTicketTailor :href="doc.link" />
      </TPopup>

      <TwTabs
        id="tabs"
        :tabs="[
          {
            name: 'About',
            to: `/events/${doc.id}`,
            current: !$route.query.view,
          },
          {
            name: 'Guests',
            to: `/events/${doc.id}?view=guests#tabs`,
            current: $route.query.view === 'guests',
          },
        ]"
      />

      <div v-if="isGoing" class="border-b bg-white p-4">
        <TPreview v-if="doc.confirmation" :content="doc.confirmation" />

        <div
          class="flex flex-col md:flex-row justify-center items-center gap-2"
        >
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
        title="Promote for free"
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

      <div v-if="!$route.query.view">
        <div v-if="doc.cover" class="relative overflow-hidden">
          <img :src="doc.cover" :alt="doc.name" class="w-full" />
        </div>

        <TPreview :content="doc.description" class="p-4" />

        <div class="flex justify-center p-4">
          <TButton
            type="link"
            :href="calendarLink"
            label="Add to Google Calendar"
            class="text-xs"
          />
        </div>

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
              hide-role
            />
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold p-4 border-t">
            {{ $t('comments.label') }}
          </h3>
          <div v-if="!uid" class="flex justify-center p-4">
            <TButton
              type="link"
              allow-guests
              :to="localePath(`/signin?target=${$route.path}`)"
              >{{ $t('event.commentsHidden') }}</TButton
            >
          </div>

          <TCommentsInline v-else :item="doc" autoload class="px-4" />
        </div>
      </div>

      <div
        v-if="$route.query.view === 'guests' && doc.star && doc.star.usernames"
        class="space-y-2 p-4"
      >
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
          <span>·</span>
          <span v-if="can('edit', 'events', doc) && doc.checkin">
            Present: {{ doc.checkin.count || 0 }}
          </span>
        </div>
        <div v-if="!uid" class="flex justify-center p-4">
          <TButton
            type="link"
            allow-guests
            :to="localePath(`/signin?target=${$route.path}`)"
            >{{ $t('event.guestsHidden') }}</TButton
          >
        </div>
        <div v-else>
          <div
            v-for="username in doc.star.usernames"
            :key="`guest-${username}`"
          >
            <WProfile :username="username">
              <div v-if="can('edit', 'events', doc)" slot="actions">
                <TReaction
                  :username="username"
                  type="primary"
                  toggled-class="bg-green-500 hover:bg-green-800"
                  icon="PlusIcon"
                  toggled-icon="CheckIcon"
                  field="checkin"
                  class="rounded-full"
                  hide-count
                  :item="doc"
                />
              </div>
            </WProfile>
          </div>
          <div v-if="!doc.star.count">There are no other guests yet.</div>
        </div>
      </div>

      <div class="m-4 text-xs text-right gap-8">
        <span
          >Created by
          <nuxt-link
            class="underline text-primary"
            :to="localePath(`/${creator.username}`)"
            >{{ creator.name }}</nuxt-link
          ></span
        >
        <span>at {{ getYmdHms(doc.createdAt, $i18n.locale) }}</span>
      </div>
      <div class="m-4 text-xs text-right gap-8">
        <span>Updated at {{ getYmdHms(doc.updatedAt, $i18n.locale) }}</span>
      </div>

      <div v-if="doc.facebook" class="m-4 text-right text-xs gap-8">
        <a :href="doc.facebook" class="text-gray-700 hover:underline"
          >Facebook Event</a
        >
      </div>

      <div class="m-4 text-right gap-8">
        <TCardActions
          :id="doc.id"
          collection="events"
          :item="doc"
          type="link"
          icon=""
        />
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
              >
                <template v-if="!uid" slot="buttons">
                  <TButton
                    allow-guests
                    :to="localePath(`/signin?target=${this.$route.fullPath}`)"
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
  </div>
</template>

<script>
import googleCalendarEventUrl from 'generate-google-calendar-url'
import { computed, ref, watch } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useDoc } from '~/use/doc'
import { useRouter } from '~/use/router'
import { useProfiles } from '~/use/profiles'
import { useReactions } from '~/use/reactions'
import { useAccounts } from '~/use/accounts'
import { useEvents } from '~/use/events'
import {
  getDay,
  getYmdHms,
  getDateTime,
  getDate,
  getTime,
  dateDiff,
  getEventDescription,
  getDateObect,
  loadDoc,
  getEventMeta,
  formatDate,
} from '~/utils'
import { addressPart } from '~/use/google'
import { trackView } from '~/use/tracking'
import { useStyles } from '~/use/styles'

export default {
  name: 'EventView',
  layout: 'full',
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

      return guestsCount
    },
    publishedAt() {
      return getDateTime(this.item?.createdAt)
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
    return getEventMeta(this.doc)
  },
  setup() {
    const { uid, can, account, username, isAdmin } = useAuth()
    const { getEventIcon, getEventTypeLabel } = useEvents()
    const { accountFields } = useAccounts()
    const { params, router } = useRouter()
    const { getProfile, getFullProfile } = useProfiles()
    const { doc, sync, exists, loading, softUpdate, remove } = useDoc('posts')
    const { find: findProfile } = useDoc('profiles')
    const { map } = useReactions()
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
    const creator = ref({})
    const org = ref({})

    async function getCachedProfile(username) {
      if (!profileCache[username]) {
        profileCache[username] = await findProfile('username', username)
      }

      return profileCache[username]
    }

    watch(doc, async () => {
      const list = doc.value.star?.usernames

      const result = {
        list: [],
        followersCount: 0,
        leadersCount: 0,
      }

      creator.value = await getFullProfile(doc.value.createdBy)
      org.value = await getFullProfile(doc.value.org?.id)

      if (!list) {
        guests.value = result

        return
      }

      if (guests.value?.list?.length) {
        return
      }

      for (const guestUsername of list) {
        const guestProfile = await getCachedProfile(guestUsername)

        result.list.push(guestProfile)
        if (guestProfile.gender === 'Female') {
          result.followersCount++
        } else if (guestProfile.gender === 'Male') {
          result.leadersCount++
        }
      }

      guests.value = result
    })

    const isGoing = computed(() => {
      return (
        doc.value.star?.usernames &&
        username.value &&
        doc.value.star.usernames.includes(username.value)
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

    async function deleteEvent(id) {
      await remove(id)
      router.push(`/${username.value}`)
    }

    return {
      formatDate,
      deleteEvent,
      creator,
      org,
      isGoing,
      isAdmin,
      softUpdate,
      isCreatingProfile,
      finishReservation,
      ticketPopup,
      account,
      reservationPopup,
      reservationFields,
      exists,
      guests,
      uid,
      loading,
      item,
      map,
      can,
      getProfile,
      getFullProfile,
      getDateTime,
      getYmdHms,
      dateDiff,
      getDate,
      getTime,
      getDay,
      getEventDescription,
      calendarLink,
      getEventIcon,
      ticketTailorPopup,
      getEventTypeLabel,
      getStyles,
    }
  },
}
</script>
