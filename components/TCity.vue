<template>
  <div>
    <THeader>
      <TButton
        v-if="profile.type === 'City'"
        slot="left"
        allow-guests
        :to="localePath('/cities')"
        icon="place"
        :label="profile.name"
      />
      <div
        v-else
        slot="left"
        class="flex flex-no-wrap items-center ml-8 md:ml-0"
      >
        <div class="ml-1 font-lato text-lg font-bold">
          {{ profile.username }}
        </div>
      </div>

      <TButton
        allow-guests
        type="nav"
        icon="search"
        :to="localePath('/search')"
      />
      <TDropdown>
        <TPopupEdit
          v-if="isAdmin()"
          type="context"
          :fields="profileFields"
          :label="$t('Edit')"
          collection="profiles"
          singular="profile"
          :item="profile"
        />
        <TCardActions
          :id="profile.id"
          collection="profiles"
          :item="profile"
          type="context"
        />
        <TButtonShare
          :id="profile.id"
          collection="profiles"
          :place="profile.place"
          :file="profile.socialCover"
          :file-name="profile.username"
          :url="`https://wedance.vip/${profile.username}`"
          :text="profile.name"
          type="context"
          :label="$t('share.title')"
        />
        <TButton
          v-if="isAdmin()"
          type="context"
          icon="delete"
          :label="$t('Delete')"
          @click="remove(profile.id)"
        />
      </TDropdown>
    </THeader>

    <div class="p-2 border-b text-center">
      <a
        href="https://bit.ly/49cYPoB"
        target="_blank"
        class="underline text-primary hover:no-underline"
        >Become a Dance Promoter – Get Discounts!</a
      >
    </div>

    <div class="grid grid-cols-4 gap-4 p-4">
      <div v-if="profile.photo">
        <img
          :src="profile.photo"
          :alt="profile.username"
          class="w-full rounded-full"
        />
      </div>

      <div :class="profile.photo ? 'col-span-3' : 'col-span-4'">
        <h1 class="leading-tight font-bold">{{ profile.name }}</h1>
        <TExpand class="mb-4">
          <TPreview :content="profile.bio" />
          <div v-if="!profile.bio" class="typo">
            <p>Welcome to {{ profile.name }} on WeDance!</p>
            <p>Hello, dancers and enthusiasts! 🕺💃</p>

            <p>
              We're excited to announce that WeDance has now arrived in
              {{ profile.name }}! As we're just stepping into this vibrant city,
              our dance event calendar might look a little empty - but not for
              long, with your help.
            </p>

            <h3>Be a Part of Our Growing Community:</h3>

            <ul>
              <li>
                <strong>Add Events:</strong> Know about a salsa night, a tango
                workshop, or a swing dance party? Add it to our platform and let
                others join in the fun.
              </li>
              <li>
                <strong>Share Local Insights:</strong> Help us map out the dance
                scene. Share information about dance organizers, popular venues,
                or active WhatsApp groups. Your knowledge is invaluable!
              </li>
              <li>
                <strong>Connect and Grow:</strong> We're more than just a
                platform; we're a community of dancers helping each other. By
                sharing and participating, you're not just finding events,
                you're helping fellow dancers experience the joy of dance in
                {{ profile.name }}.
              </li>
            </ul>
            <p class="mt-4">
              Together, we can make {{ profile.name }} a thriving hub for dance
              lovers. Whether you're a local or just passing through, let's
              create a space where every dancer can find their rhythm. Thank you
              for joining us on this journey.
            </p>
            <p>Let's dance the night away!</p>
            <p>
              With excitement,<br />
              WeDance Team
            </p>
          </div>
        </TExpand>

        <div class="text-xs text-gray-500">
          {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
          ·
          {{
            $tc('subscribers', subscribersCount, {
              count: subscribersCount,
            })
          }}
        </div>

        <div v-if="profile.type === 'City'" class="flex space-x-2 mt-4">
          <TButton
            :to="localePath('/events/-/import')"
            type="primary"
            icon="plus"
            label="Add Event"
          />
          <TReaction
            :label="$t('Subscribe')"
            :toggled-label="$t('Unsubscribe')"
            field="watch"
            icon="BellIcon"
            hide-count
            :item="profile"
            collection="profiles"
          />
        </div>
      </div>
    </div>

    <div v-if="false" class="p-4">
      <router-link to="/find-partner/start">
        <div class="border rounded font-bold flex p-4 hover:bg-slate-200">
          <div>Find Dance Partner</div>
          <div class="flex-grow"></div>
          <ChevronRightIcon />
        </div>
      </router-link>
    </div>

    <div class="border-t bg-orange-50">
      <div class="text-xs pt-2 pr-2 text-right text-primary">SPONSORED</div>
      <NuxtLink
        v-if="promo && promo.id"
        :to="localePath(`/events/${promo.id}`)"
        class="hover:opacity-75"
      >
        <TEventText3 :item="promo" />
      </NuxtLink>
    </div>

    <TCollapse title="Events" expanded>
      <TCalendar :profile="profile" class="mt-4 w-full border-t pt-4 pb-8">
        <TEventListNoLoad
          :community="profile.username"
          :username="profile.username"
          :docs="events"
        />
      </TCalendar>
      <div class="text-xs p-2">
        {{ mentions.join(' ') }}
      </div>
    </TCollapse>

    <TCollapse title="News">
      <TPostList order-by="createdAt" :filter="{ place: profile.place }" />
    </TCollapse>

    <TCollapse title="Organisers">
      <TCommunity type="Organiser" class="pt-4 border-t" hide-role />
    </TCollapse>

    <TCollapse title="Venues">
      <TCommunity type="Venue" class="pt-4 border-t" hide-role />
    </TCollapse>

    <TCollapse title="Artists">
      <TCommunity type="Artist" class="pt-4 border-t" hide-role />
    </TCollapse>

    <TCollapse title="Dancers">
      <TCommunity type="Dancer" class="pt-4 border-t" />
    </TCollapse>

    <WTeaser
      v-if="!uid && profile.type !== 'City' && profile.place"
      :title="$t('profile.invite.header', { count: invitesLeft })"
      :description="$t('profile.invite.description', { name: profile.name })"
      :button="$t('profile.invite.action')"
      :url="localePath(`/signin?invitedBy=${profile.username}`)"
      class="my-0"
    />

    <div
      v-if="
        profile.reviews &&
          profile.type !== 'City' &&
          profile.username !== 'Travel'
      "
    >
      <h3 class="text-xl font-bold p-4 border-t">{{ $t('reviews.title') }}</h3>
      <TReviewList :reviews="profile.reviews" class="p-4" />
    </div>

    <WTeaser
      v-if="profile.type === 'City' && profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatExists')"
      :href="profile.website"
      class="w-full mt-4"
    />

    <WTeaser
      v-if="profile.type === 'City' && !profile.website"
      :allow-guests="false"
      :title="$t('teaser.chat.title')"
      :description="$t('teaser.chat.description')"
      :button="$t('teaser.chat.btnChatMissing')"
      :href="internationalChatLink"
      class="w-full mt-4"
    />

    <div
      v-if="profile.id !== profile.createdBy && profile.type !== 'City'"
      class="py-4 flex justify-center"
    >
      <TButton
        type="simple"
        :label="$t('profile.claim')"
        :href="`mailto:support@wedance.vip?subject=Claim ${profile.username}`"
      />
    </div>

    <TPostList
      v-if="profile.type !== 'City'"
      :filter="{ username: profile.username }"
      class="mt-4 w-full border-t"
    />

    <div
      v-if="profile.type === 'City' && profile.instagram"
      class="bg-gray-100 py-4 flex justify-center"
    >
      <div class="max-w-md py-4 space-y-1">
        <div class="flex justify-center"></div>
        <h3 class="text-2xl font-extrabold text-center">
          {{ $t('profile.follow.title') }}
        </h3>
        <p class="text-center">
          {{ $t('profile.follow.description') }}
        </p>
        <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
          <TButton
            v-if="profile.youtube"
            allow-guests
            icon="youtube"
            type="round"
            icon-size="6"
            :href="profile.youtube"
          />
          <TButton
            v-if="profile.instagram"
            allow-guests
            icon="instagram"
            type="round"
            icon-size="6"
            :href="profile.instagram"
          />
          <TButton
            v-if="profile.telegram"
            allow-guests
            icon="telegram"
            type="round"
            icon-size="6"
            :href="profile.telegram"
          />
          <TButton
            v-if="profile.twitter"
            allow-guests
            icon="twitter"
            type="round"
            icon-size="6"
            :href="profile.twitter"
          />
          <TButton
            v-if="profile.tiktok"
            allow-guests
            icon="tiktok"
            type="round"
            icon-size="6"
            :href="profile.tiktok"
          />
          <TButton
            v-if="profile.facebook"
            allow-guests
            icon="facebook"
            type="round"
            icon-size="6"
            :href="profile.facebook"
          />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-2xl font-extrabold text-center p-4">
        Dance Events Near Me
      </h3>
      <ul>
        <li
          v-for="style in ['Salsa', 'Bachata', 'Kizomba', 'Zouk', 'Afrobeats']"
          :key="style"
          class="p-4 border-t w-full"
        >
          <nuxt-link :to="localePath(`/${profile.username}?style=${style}`)"
            >{{ style }} in {{ profile.name }}</nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ChevronRightIcon } from '@vue-hero-icons/outline'
import { computed, onMounted, ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getCityMeta, getDateObect } from '~/utils'
import { useI18n } from '~/use/i18n'
import { useDoc } from '~/use/doc'
import { useCities } from '~/use/cities'
import { getEventsInPlace } from '~/use/events'

export default {
  components: {
    ChevronRightIcon,
  },
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  head() {
    return getCityMeta(this.profile, this.events, this.$route.query.style)
  },
  setup(props, { root }) {
    const internationalChatLink = 'https://t.me/+Vxw15sDG-dWpqHDj'
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { getCity } = useApp()
    const { t } = useI18n()
    const { remove } = useDoc('profiles')
    const { load, doc: promo } = useDoc('posts')
    const invitesLeft = 5
    const { switchCity } = useCities()
    const community = computed(() => getCity(props.profile?.place))
    const events = ref([])

    const mentions = computed(() => {
      const result = []

      for (const event of events.value) {
        result.push(event.org.instagram)

        for (const artist of event.artists) {
          result.push(artist.instagram)
        }
      }

      return result
        .filter((x) => x)
        .map((x) =>
          x
            .replace(/https?:\/\/(www.)?instagram.com\//, '@')
            .replace(/\/.*$/, '')
        )
        .filter((v, i, a) => a.indexOf(v) === i)
    })

    const intro = {
      fields: [
        {
          name: 'photo',
          label: t('myprofile.intro.photo'),
        },
        {
          name: 'gender',
          label: t('myprofile.intro.gender'),
        },
        {
          name: 'styles',
          label: t('myprofile.intro.styles'),
        },
        {
          name: 'bio',
          label: t('myprofile.intro.bio'),
        },
        {
          name: 'place',
          label: t('myprofile.intro.place'),
        },
        {
          name: 'objectives',
          label: t('myprofile.intro.objectives'),
        },
      ],
      missing: [],
      visible: false,
    }
    for (const field of intro.fields) {
      if (!props.profile[field.name]) {
        intro.missing.push(field)
        intro.visible = true
      }
    }

    const subscribersCount = computed(() => {
      return props.profile?.watch?.usernames?.length || 0
    })

    onMounted(async () => {
      await switchCity(props.profile.place)
      events.value = await getEventsInPlace(props.profile?.place)
      load('yEfJWBnepn0u6gOVmUor')
    })

    return {
      events,
      mentions,
      getDateObect,
      promo,
      internationalChatLink,
      intro,
      uid,
      can,
      getExcerpt,
      profileFields,
      getCity,
      isAdmin,
      community,
      invitesLeft,
      subscribersCount,
      remove,
    }
  },
}
</script>
