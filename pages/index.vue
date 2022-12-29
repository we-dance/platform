<template>
  <div class="font-noto bg-white min-h-screen">
    <main>
      <div class="relative sm:overflow-hidden">
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
        <div>
          <div class="relative sm:overflow-hidden">
            <nav class="relative flex p-4 justify-between">
              <TIcon size="4" name="logo-horizontal-dark" />
              <TButton
                allow-guests
                type="primary"
                to="/signin"
                :label="$t('auth.signin')"
              />
            </nav>

            <div class="relative p-4 sm:p-10 lg:p-14">
              <div class="text-center">
                <h4 class="font-bold text-2xl">
                  {{ $t('home.cta.header') }}
                </h4>
                <p>{{ $t('home.cta.description') }}</p>
              </div>

              <div class="max-w-lg mx-auto">
                <TButton
                  allow-guests
                  icon="search"
                  :label="$t('home.cta.action')"
                  to="/cities"
                  type="void"
                  class="mt-8 w-full text-gray-500 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
                />
              </div>

              <div
                class="mt-2 max-w-lg text-xs mx-auto text-center sm:max-w-3xl"
              >
                <p>{{ $t('hero.submotto') }}.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 bg-light">
        <div
          class="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 max-w-4xl mx-auto"
        >
          <div class="py-8 space-y-1 bg-light">
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
                to="/events"
                class="underline font-bold hover:no-underline"
                >{{ $t('features.calendar.action') }}</NuxtLink
              >
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
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
                to="/community"
                class="underline font-bold hover:no-underline"
                >{{ $t('features.dancePartners.action') }}</NuxtLink
              >
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
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
                to="/Travel"
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

    <div class="bg-dark text-white">
      <TFooter class="p-4 mx-auto max-w-4xl" />
    </div>
  </div>
</template>

<script>
import { onMounted, watch } from 'vue-demi'
import { useAuth } from '~/use/auth'
import { useRouter } from '~/use/router'

export default {
  name: 'Index',
  layout: 'empty',
  setup() {
    const { profile } = useAuth()
    const { router } = useRouter()

    watch(profile, (p) => {
      router.push('/feed')
    })

    onMounted(() => {
      if (profile.value?.username) {
        router.push('/feed')
      }
    })
  },
}
</script>
