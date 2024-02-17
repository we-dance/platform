<template>
  <div class="font-noto bg-white min-h-screen">
    <THeader show-logo class="md:hidden" />
    <main>
      <div class="relative sm:overflow-hidden">
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
        <div>
          <div class="relative sm:overflow-hidden">
            <div class="relative py-10 lg:p-14 px-4 md:px-8">
              <div class="text-center">
                <h1 class="font-bold text-2xl">
                  {{ $t('home.cta.header') }}
                </h1>
                <p>{{ $t('home.cta.description') }}</p>
              </div>

              <div class="max-w-lg mx-auto">
                <TButton
                  allow-guests
                  icon="search"
                  :label="$t('home.cta.action')"
                  :to="localePath('/explore')"
                  type="void"
                  class="mt-8 w-full text-gray-500 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
                />
              </div>

              <div
                class="mt-2 max-w-lg text-xs mx-auto text-center sm:max-w-3xl"
              >
                <p>
                  {{ $t('hero.submotto') }}. Our biggest communities are in
                  <router-link
                    to="/explore/Munich"
                    class="underline text-primary hover:no-underline"
                    >Munich</router-link
                  >
                  and
                  <router-link
                    to="/explore/Berlin"
                    class="underline text-primary hover:no-underline"
                    >Berlin</router-link
                  >. Our mission is to unite dancers worldwide.
                  <router-link
                    class="underline text-primary hover:no-underline"
                    to="/about"
                    >Read more</router-link
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div class="p-4 space-y-1 bg-light rounded shadow">
            <h3 class="text-2xl font-extrabold text-center">
              {{ numbers ? numbers.countries : '...' }}
            </h3>
            <p class="text-center">
              {{ $t('home.numbers.countries') }}
            </p>
          </div>
          <div class="p-4 space-y-1 bg-light rounded shadow">
            <h3 class="text-2xl font-extrabold text-center">
              {{ numbers ? numbers.profiles : '...' }}
            </h3>
            <p class="text-center">
              {{ $t('home.numbers.profiles') }}
            </p>
          </div>
          <div class="p-4 space-y-1 bg-light rounded shadow">
            <h3 class="text-2xl font-extrabold text-center">
              {{ numbers ? numbers.events : '...' }}
            </h3>
            <p class="text-center">
              {{ $t('home.numbers.events') }}
            </p>
          </div>
        </div>
      </div>
      <h2 class="px-4 text-lg font-bold">Why WeDance?</h2>
      <div class="m-4 border rounded">
        <TPreview
          v-if="$route.query.v == '2'"
          :content="$t('home.founder2')"
          class="p-4"
        />
        <TPreview v-else :content="$t('home.founder')" class="p-4" />
        <WProfile username="alexrazbakov" hide-role hide-buttons />
      </div>
      <div class="p-4">
        <h2 class="text-lg font-bold mb-4">Features</h2>
        <div class="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div class="p-4 space-y-1 bg-light rounded shadow">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img
                  src="/img/event-calendar.svg"
                  :alt="$t('features.calendar.title')"
                />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">
              {{ $t('features.calendar.title') }}
            </h3>
            <p class="text-center">
              {{ $t('features.calendar.description') }}<br />
              <NuxtLink
                :to="localePath('/explore')"
                class="underline font-bold hover:no-underline"
                >{{ $t('features.calendar.action') }}</NuxtLink
              >
            </p>
          </div>
          <div class="p-4 space-y-1 bg-light rounded shadow">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img
                  src="/img/dance-partners.svg"
                  :alt="$t('features.dancePartners.title')"
                />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">
              {{ $t('features.dancePartners.title') }}
            </h3>
            <p class="text-center">
              {{ $t('features.dancePartners.description') }}<br />
              <NuxtLink
                :to="localePath('/find-partner/start')"
                class="underline font-bold hover:no-underline"
                >{{ $t('features.dancePartners.action') }}</NuxtLink
              >
            </p>
          </div>
          <div class="p-4 space-y-1 bg-light rounded shadow">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img
                  src="/img/dance-travel.svg"
                  :alt="$t('features.danceTravel.title')"
                />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">
              {{ $t('features.danceTravel.title') }}
            </h3>
            <p class="text-center">
              {{ $t('features.danceTravel.description') }}<br />
              <NuxtLink
                :to="localePath('/Travel')"
                class="underline font-bold hover:no-underline"
                >{{ $t('features.danceTravel.action') }}</NuxtLink
              >
            </p>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 py-4 flex justify-center">
        <div class="max-w-md py-4 space-y-1">
          <div class="flex justify-center"></div>
          <h3 class="text-2xl font-extrabold text-center">
            {{ $t('international.title') }}
          </h3>
          <p class="text-center">
            {{ $t('international.description') }}
          </p>
          <div class="p-4 flex flex-wrap gap-2 items-center justify-center">
            <TButton
              allow-guests
              icon="youtube"
              type="round"
              icon-size="6"
              href="https://www.youtube.com/channel/UC1pdWS3nCLrd8LnQyNNSNUw"
            />
            <TButton
              allow-guests
              icon="instagram"
              type="round"
              icon-size="6"
              href="https://instagram.com/WeDancePlatform"
            />
            <TButton
              allow-guests
              icon="telegram"
              type="round"
              icon-size="6"
              href="https://t.me/WeDanceTravel"
            />
            <TButton
              allow-guests
              icon="twitter"
              type="round"
              icon-size="6"
              href="https://twitter.com/WeDancePlatform"
            />
            <TButton
              allow-guests
              icon="tiktok"
              type="round"
              icon-size="6"
              href="https://tiktok.com/@WeDanceVIP"
            />
            <TButton
              allow-guests
              icon="facebook"
              type="round"
              icon-size="6"
              href="https://www.facebook.com/WeDance-109777921433083"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useAlgolia } from '~/use/algolia'
import { useAuth } from '~/use/auth'

export default {
  name: 'Index',
  layout: 'default',
  setup() {
    const { uid, username } = useAuth()

    const { response: responseProfiles, search: searchProfiles } = useAlgolia(
      'profiles'
    )

    const { response: responseEvents, search: searchEvents } = useAlgolia(
      'events'
    )

    const numbers = ref(null)

    onMounted(async () => {
      await searchProfiles('', {
        filters: ``,
        facets: ['style', 'locality', 'country'],
        hitsPerPage: 0,
        maxValuesPerFacet: 1000,
        analytics: false,
      })

      await searchEvents('', {
        filters: ``,
        facets: ['style', 'locality', 'country'],
        hitsPerPage: 0,
        maxValuesPerFacet: 1000,
        analytics: false,
      })

      numbers.value = {
        profiles: responseProfiles.value.nbHits,
        events: responseEvents.value.nbHits,
        cities: Object.keys(responseProfiles.value.facets.locality).length,
        countries: Object.keys(responseProfiles.value.facets.country).length,
      }
    })

    return { uid, username, numbers }
  },
}
</script>
