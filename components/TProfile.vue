<template>
  <div>
    <THeader>
      <TButton
        v-if="profile.type === 'City'"
        slot="left"
        allow-guests
        to="/cities"
        icon="place"
        :label="profile.name"
      />
      <div
        v-else
        slot="left"
        class="flex flex-no-wrap items-center ml-8 md:ml-0"
      >
        <h1 class="ml-1 font-lato text-lg font-bold">
          {{ profile.username }}
        </h1>
      </div>

      <TButton allow-guests type="nav" icon="search" to="/search" />
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
    <div class="h-48 relative">
      <div class="h-32 bg-red-500"></div>
      <img
        v-if="profile.photo"
        :src="profile.photo"
        :alt="profile.username"
        class="
          absolute
          left-1/2
          top-9
          h-36
          w-36
          rounded-full
          transform
          -translate-x-1/2
          border-8 border-white
        "
      />
      <TIcon
        v-else-if="profile.type !== 'City'"
        name="undraw_profile_pic"
        class="absolute
          left-1/2
          top-9
          h-36
          w-36
          rounded-full
          transform
          -translate-x-1/2
          border-8
          border-white"
      />
    </div>
    <div class="h-24 pt-2 pd-2 g-4 border-b-2 border-gray-200">
      <div
        class="
          text-3xl
          font-bold
          tracking-tight
          font-noto
          text-center
          drop-shadow-lg
        "
      >
        {{ profile.name }}
      </div>
      <!-- <div class="font-noto text-center pt-2"></div> -->
      <div class="font-noto text-center text-gray-500">
        {{ $tc('views', profile.viewsCount, { count: profile.viewsCount }) }}
        ·
        {{
          $tc('subscribers', subscribersCount, {
            count: subscribersCount,
          })
        }}
      </div>
    </div>
    <div class="h-24">
      <div class="h-8 mt-2 mb-2 text-[0px] ">
        <div class="relative h-8 w-1/3 inline-block ">
          <div
            class="relative left-1/2 h-8 w-8 rounded-full bg-white transform -translate-x-1/2 border-b-2 border-gray-200"
          >
            <svg
              class="relative left-1/2 top-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
              />
              <path
                d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
              />
            </svg>
          </div>
        </div>
        <div class="relative h-8 w-1/3 inline-block ">
          <div
            class="relative left-1/2 h-8 w-8 rounded-full bg-white transform -translate-x-1/2 border-b-2 border-gray-200"
          >
            <svg
              class="relative left-1/2 top-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              version="1.1"
              id="Livello_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 240.1 240.1"
              enable-background="new 0 0 240.1 240.1"
              xml:space="preserve"
            >
              <g id="Artboard">
                <linearGradient
                  id="Oval_1_"
                  gradientUnits="userSpaceOnUse"
                  x1="-838.041"
                  y1="660.581"
                  x2="-838.041"
                  y2="660.3427"
                  gradientTransform="matrix(1000 0 0 -1000 838161 660581)"
                >
                  <stop offset="0" style="stop-color:#424d58" />
                  <stop offset="1" style="stop-color:#272a2f" />
                </linearGradient>
                <circle
                  id="Oval"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  fill="url(#Oval_1_)"
                  cx="120.1"
                  cy="120.1"
                  r="120.1"
                />
                <path
                  id="Path-3"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  fill="#FFFFFF"
                  d="M54.3,118.8c35-15.2,58.3-25.3,70-30.2
		c33.3-13.9,40.3-16.3,44.8-16.4c1,0,3.2,0.2,4.7,1.4c1.2,1,1.5,2.3,1.7,3.3s0.4,3.1,0.2,4.7c-1.8,19-9.6,65.1-13.6,86.3
		c-1.7,9-5,12-8.2,12.3c-7,0.6-12.3-4.6-19-9c-10.6-6.9-16.5-11.2-26.8-18c-11.9-7.8-4.2-12.1,2.6-19.1c1.8-1.8,32.5-29.8,33.1-32.3
		c0.1-0.3,0.1-1.5-0.6-2.1c-0.7-0.6-1.7-0.4-2.5-0.2c-1.1,0.2-17.9,11.4-50.6,33.5c-4.8,3.3-9.1,4.9-13,4.8
		c-4.3-0.1-12.5-2.4-18.7-4.4c-7.5-2.4-13.5-3.7-13-7.9C45.7,123.3,48.7,121.1,54.3,118.8z"
                />
              </g>
            </svg>
          </div>
        </div>
        <div class="relative h-8 w-1/3 inline-block ">
          <div
            class="relative left-1/2 h-8 w-8 rounded-full bg-white transform -translate-x-1/2 border-b-2 border-gray-200"
          >
            <svg
              class="relative left-1/2 top-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="h-8 mt-2 mb-2 text-[0px] ">
        <div class="relative h-8 w-1/3 inline-block ">
          <div
            class="relative left-1/2 h-8 w-8 rounded-full bg-white transform -translate-x-1/2 border-b-2 border-gray-200"
          >
            <svg
              class="relative left-1/2 top-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z"
              />
            </svg>
          </div>
        </div>
        <div class="relative h-8 w-1/3 inline-block ">
          <div
            class="relative left-1/2 h-8 w-8 rounded-full bg-white transform -translate-x-1/2 border-b-2 border-gray-200"
          >
            <svg
              class="relative left-1/2 top-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"
              />
            </svg>
          </div>
        </div>
        <div class="relative h-8 w-1/3 inline-block ">
          <div
            class="relative left-1/2 h-8 w-8 rounded-full bg-white transform -translate-x-1/2 border-b-2 border-gray-200"
          >
            <svg
              class="relative left-1/2 top-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              width="256"
              height="256"
              viewBox="0 0 256 256"
              xml:space="preserve"
            >
              <defs></defs>
              <g
                style="
                  stroke: none;
                  stroke-width: 0;
                  stroke-dasharray: none;
                  stroke-linecap: butt;
                  stroke-linejoin: miter;
                  stroke-miterlimit: 10;
                  fill: none;
                  fill-rule: nonzero;
                  opacity: 1;
                "
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
              >
                <path
                  d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 72.039 33.277 v 6.758 c -3.187 0.001 -6.283 -0.623 -9.203 -1.855 c -1.878 -0.793 -3.627 -1.814 -5.227 -3.048 l 0.048 20.801 c -0.02 4.684 -1.873 9.085 -5.227 12.4 c -2.73 2.698 -6.188 4.414 -9.937 4.97 c -0.881 0.13 -1.777 0.197 -2.684 0.197 c -4.013 0 -7.823 -1.3 -10.939 -3.698 c -0.586 -0.452 -1.147 -0.941 -1.681 -1.468 c -3.635 -3.593 -5.509 -8.462 -5.194 -13.584 c 0.241 -3.899 1.802 -7.618 4.404 -10.532 c 3.443 -3.857 8.26 -5.998 13.41 -5.998 c 0.906 0 1.803 0.068 2.684 0.198 v 2.499 v 6.951 c -0.835 -0.275 -1.727 -0.427 -2.656 -0.427 c -4.705 0 -8.512 3.839 -8.442 8.548 c 0.045 3.013 1.69 5.646 4.118 7.098 c 1.141 0.682 2.453 1.105 3.853 1.182 c 1.097 0.06 2.151 -0.093 3.126 -0.415 c 3.362 -1.111 5.787 -4.268 5.787 -7.992 l 0.011 -13.93 V 16.5 h 9.307 c 0.009 0.922 0.103 1.822 0.276 2.694 c 0.702 3.529 2.692 6.591 5.46 8.678 c 2.414 1.821 5.42 2.9 8.678 2.9 c 0.002 0 0.029 0 0.027 -0.002 V 33.277 z"
                  style="
                    stroke: none;
                    stroke-width: 1;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: rgb(0, 0, 0);
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="h-20 pb-12 pl-4 pr-4 g-2 border-b-2 border-gray">
      <TReaction
        class="w-full"
        v-if="uid !== profile.id"
        :label="$t('Subscribe')"
        :toggled-label="$t('Unsubscribe')"
        field="watch"
        icon="BellIcon"
        hide-count
        :item="profile"
        collection="profiles"
      />
    </div>
    <!-- <TInputButtons v-model="tab" :options="tabs" /> -->

    <div class="grid grid-cols-4 gap-4 p-4">
      <div class="col-span-3">
        <TExpand class="text-sm mb-4">
          <TPreview :content="profile.bio" />
          <TProfileDetails v-if="profile.type !== 'City'" :profile="profile" />
        </TExpand>

        <div v-if="profile.type === 'City'" class="flex space-x-2 mt-4">
          <TButton
            to="/events/-/edit"
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

    <!-- <div v-if="profile.type !== 'City'" class="flex space-x-2 p-4 justify-end">
      <TButton
        v-if="uid === profile.id"
        type="primary"
        :label="$t('myprofile.edit')"
        to="/settings?tab=profile"
      />
      <TButton v-if="uid === profile.id" to="/posts/-/edit" type="base">{{
        $t('myprofile.addPost')
      }}</TButton>

      <TProfileContacts
        :profile="profile"
        :title="$t('Contact')"
        type="simple"
      />
    </div> -->
    <div></div>
    <WTeaser
      v-if="profile.partner === 'Yes'"
      :title="$t('profile.partnerSearch.title')"
      :description="profile.partnerBio"
      class="w-full mt-4"
    />

    <template v-if="$route.query.beta">
      <TCalendar
        v-if="profile.type === 'City' && profile.username !== 'Travel'"
        class="mt-4 w-full border-t pt-4 pb-8"
      />
    </template>

    <template v-if="!$route.query.beta">
      <TLoader v-if="!loaded" class="py-4" />
      <TEventListNoLoad
        v-else
        :community="profile.username"
        :username="profile.username"
        :docs="events"
        class="w-full border-b border-t pt-4"
      />
    </template>

    <TCommunity
      v-if="profile.type === 'City' && profile.username !== 'Travel'"
      class="pt-4 border-t"
    />

    <WTeaser
      v-if="!uid && profile.type !== 'City' && profile.place"
      :title="$t('profile.invite.header', { count: invitesLeft })"
      :description="$t('profile.invite.description', { name: profile.name })"
      :button="$t('profile.invite.action')"
      :url="`/signin?invitedBy=${profile.username}`"
      class="my-0"
    />

    <div v-if="profile.reviews">
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
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue-demi'
import { useApp } from '~/use/app'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { getExcerpt, getMeta } from '~/utils'
import { useI18n } from '~/use/i18n'
import { useDoc } from '~/use/doc'
import {
  getEventsInPlace,
  getEventsOrganisedBy,
  getEventsWithArtist,
  getEventsWithGuest,
  getFestivals,
} from '~/use/events'
import { useCities } from '~/use/cities'

export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  head() {
    return getMeta('profiles', this.profile)
  },
  setup(props, { root }) {
    const internationalChatLink = 'https://t.me/+Vxw15sDG-dWpqHDj'
    const { uid, isAdmin, can } = useAuth()
    const { profileFields } = useProfiles()
    const { switchCity } = useCities()
    const { getCity } = useApp()
    const { t } = useI18n()
    const { remove } = useDoc('profiles')
    const invitesLeft = 5
    const community = computed(() => getCity(props.profile?.place))
    const tab = ref('about')
    const tabs = [
      {
        label: t('About'),
        value: 'about',
      },
      {
        label: t('Feed'),
        value: 'feed',
      },
      {
        label: t('Upcoming events'),
        value: 'events',
      },
    ]

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

    const events = ref([])
    const loaded = ref(false)

    const subscribersCount = computed(() => {
      return props.profile?.watch?.count || 0
    })

    onMounted(async () => {
      let result = []

      if (props.profile.username === 'Travel') {
        result = await getFestivals()
      } else if (props.profile.type === 'City') {
        await switchCity(props.profile.place)
        result = await getEventsInPlace(props.profile.place)
      } else {
        result = [
          ...result,
          ...(await getEventsOrganisedBy(props.profile?.username)),
        ]
        result = [
          ...result,
          ...(await getEventsWithArtist(props.profile?.username)).filter(
            (item) => !result.find((existing) => existing.id === item.id)
          ),
        ]
        result = [
          ...result,
          ...(await getEventsWithGuest(props.profile?.username)).filter(
            (item) => !result.find((existing) => existing.id === item.id)
          ),
        ]
      }

      events.value = result
      loaded.value = true
    })

    return {
      internationalChatLink,
      intro,
      loaded,
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
      events,
      tab,
      tabs,
    }
  },
}
</script>
