<template>
  <div class="font-noto bg-dark min-h-screen">
    <main>
      <div class="relative sm:overflow-hidden">
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
        <div>
          <div class="relative sm:overflow-hidden">
            <div class="absolute inset-0">
              <img
                class="h-full w-full object-cover"
                alt="People dancing bachata"
                src="/img/hero_640.jpg"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, (max-width: 1536px) 100vw, 100vw"
                srcset="
                  /img/hero_640.jpg   640w,
                  /img/hero_768.jpg   768w,
                  /img/hero_1024.jpg 1024w,
                  /img/hero_1280.jpg 1280w,
                  /img/hero_1536.jpg 1536w,
                  /img/hero_1536.jpg 1536w
                "
              />
              <div class="absolute inset-0 bg-black opacity-50" />
            </div>

            <nav class="relative flex p-4 justify-end">
              <TButton
                allow-guests
                type="simple"
                to="/signin"
                :label="$t('signin')"
              />
            </nav>

            <div class="relative p-4 sm:p-10 lg:p-14">
              <div class="flex justify-center">
                <TIcon name="logo-vertical-white" />
              </div>

              <p
                class="mt-2 max-w-lg mx-auto text-center sm:max-w-3xl text-white"
              >
                Even one dance contact in a city makes a difference
              </p>

              <div class="max-w-lg mx-auto">
                <TButton
                  allow-guests
                  icon="search"
                  label="Search dancers"
                  to="/search"
                  type="void"
                  class="mt-8 w-full text-gray-500 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
                />
              </div>

              <div class="flex justify-center">
                <div class="mt-8 flex space-x-4 font-bold text-white">
                  <div class="flex flex-col items-center justify-center">
                    <TIcon name="group" class="h-16 w-16" />
                    <div class="text-4xl">1309</div>
                    <div class="text-sm">dancers</div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <TIcon name="location" class="h-16 w-16" />
                    <div class="text-4xl">102</div>
                    <div class="text-sm">cities</div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <TIcon name="calendar" class="h-16 w-16" />
                    <div class="text-4xl">441</div>
                    <div class="text-sm">events</div>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-center">
                <TButton
                  allow-guests
                  type="primary"
                  to="/register"
                  label="Join the community"
                />
              </div>

              <p
                class="mt-8 max-w-lg mx-auto text-center sm:max-w-3xl text-white"
              >
                Salsa, Bachata, Kizomba, Urban Kiz, Raggaeton, Casino, Tango and
                130 more dance styles
              </p>
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
                <img src="/img/event-calendar.svg" alt="Event Calendar" />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">Event Calendar</h3>
            <p class="text-center">
              Find dance workshops, courses, socials and parties. We fill event
              calendar all together as a community. Everyone can share.
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img src="/img/dance-partners.svg" alt="Dance Partners" />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">Dance Partners</h3>
            <p class="text-center">
              Find a dance partner for your dance style and let them find you.
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img src="/img/city-chats.svg" alt="City Chats" />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">City Chats</h3>
            <p class="text-center">
              Find dance chat in any city. Join your city chat and invite your
              friends to help new dancers in the city. Think globally, act
              locally.
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img src="/img/dance-travel.svg" alt="Dance Travel" />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">Dance Travel</h3>
            <p class="text-center">
              Find international dance festivals and congresses. Share a ride,
              an appartment and find a buddy to experience a new city together.
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img src="/img/volunteer.svg" alt="Volunteer" />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">Volunteer</h3>
            <p class="text-center">
              We build a community, where everyone enters with mindset “I can
              help”, so whenever you need help you can count on it. We are one
              big family worldwide. We help each other.<br />
              <router-link
                to="/get-involved"
                class="underline font-bold hover:no-underline"
                >Get Involved</router-link
              >
            </p>
          </div>
          <div class="py-8 space-y-1 bg-light">
            <div class="flex justify-center ">
              <div
                class="flex items-center justify-center w-20 h-20 bg-white rounded-full "
              >
                <img src="/img/interviews.svg" alt="Interviews" />
              </div>
            </div>
            <h3 class="text-2xl font-extrabold text-center">Interviews</h3>
            <p class="text-center">
              Explore more about you favorite dance artists and catch their tips
              &amp; tricks.<br />
              <a
                href="https://anchor.fm/wedance"
                target="_blank"
                class="underline font-bold hover:no-underline"
                >Listen to Podcast</a
              >
            </p>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 py-4 flex justify-center">
        <div class="max-w-md py-4 space-y-1">
          <div class="flex justify-center"></div>
          <h3 class="text-2xl font-extrabold text-center">
            International Community
          </h3>
          <p class="text-center">
            We regularly post interviews, event announcements and introduce new
            members on our social media.
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
              href="https://instagram.com/WeDanceVIP"
            />
            <TButton
              allow-guests
              icon="telegram"
              type="round"
              icon-size="6"
              href="https://t.me/WeDanceVIP"
            />
            <TButton
              allow-guests
              icon="twitter"
              type="round"
              icon-size="6"
              href="https://twitter.com/WeDanceVIP"
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
