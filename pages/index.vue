<template>
  <div>
    <nav
      class="mx-auto max-w-2xl mt-4 mb-4 px-4 flex justify-between items-center"
    >
      <div>
        <TIcon name="logo-horizontal-dark" />
      </div>
      <div class="flex space-x-2">
        <TButton type="nav" icon="search" to="/search" />
        <TButton type="secondary" to="/signin" :label="$t('signin')" />
      </div>
    </nav>

    <div class="py-8">
      <div class="px-4 mx-auto max-w-2xl text-center">
        <div class="mx-auto max-w-xs mb-4">
          <TIcon name="undraw_i_can_fly" />
        </div>
        <h1 class="text-4xl leading-tight font-montserrat font-bold">
          {{ $t('hero.title') }}
        </h1>
        <p class="mt-2">
          {{ $t('hero.subtitle') }}
        </p>
        <div>
          <TButton
            class="mt-4 mr-4"
            type="primary"
            to="/register"
            :label="$t('signup')"
          />
        </div>
      </div>
    </div>

    <div class="mt-8 p-4 max-w-md mx-auto">
      <h2 class="mt-4 mb-10 text-3xl font-montserrat leading-tight text-center">
        Who can join WeDance?
      </h2>
      <div class="typo">
        <p>
          WeDance is for all of you, who's interested in dancing! Salsa,
          Bachata, Kizomba, Zouk, you name it! We are open for all dances!
        </p>
        <p>
          You can post information about events, parties, social meetings, share
          dancing music, videos and other things associated with social dances.
        </p>
        <p>
          Enjoy networking and meeting new dancers in your area or while
          traveling to other cities.
        </p>
        <p>It's free to join for anyone.</p>
      </div>
    </div>

    <div class="mt-8 p-4 max-w-2xl mx-auto">
      <h2 class="mt-4 mb-10 text-3xl font-montserrat leading-tight text-center">
        Your dance journey with WeDance
      </h2>
      <div class="mt-16 flex min-w-full justify-end items-center">
        <div class="w-1/3">
          <TIcon name="undraw_i_can_fly" class="pr-4" />
        </div>
        <div class="w-2/3 h-40">
          <h2 class="font-lato font-bold text-xl">Start dancing</h2>
          <p>
            Discover all dance styles in your city, find your passion, get
            inspired and plan your first workshop.
          </p>
        </div>
      </div>
      <div class="mt-16 flex min-w-full justify-start items-center">
        <div class="w-2/3 h-40">
          <h2 class="font-lato font-bold text-xl">Find dance partner</h2>
          <p>
            Let us know who you are looking for and let them find you.
          </p>
        </div>
        <div class="w-1/3">
          <TIcon name="undraw_together" class="pl-4" />
        </div>
      </div>
      <div class="mt-16 flex min-w-full justify-end items-center">
        <div class="w-1/3">
          <TIcon name="undraw_events" class="pr-4" />
        </div>
        <div class="w-2/3 h-40">
          <h2 class="font-lato font-bold text-xl">
            Find parties
          </h2>
          <p>
            We monitor all activities in dance scene and provide you with event
            calendar, which will highlight the best party for you.
          </p>
        </div>
      </div>
      <div class="mt-16 flex min-w-full justify-start items-center">
        <div class="w-2/3 h-40">
          <h2 class="font-lato font-bold text-xl">Improve dancing</h2>
          <p>
            Find and connect with dance instructors, dance schools and
            festivals.
          </p>
        </div>
        <div class="w-1/3">
          <TIcon name="undraw_super_woman" class="pl-4" />
        </div>
      </div>

      <div class="mt-16 flex min-w-full justify-end items-center">
        <div class="w-1/3">
          <TIcon name="undraw_online_ad" class="pr-4" />
        </div>
        <div class="w-2/3 h-40">
          <h2 class="font-lato font-bold text-xl">Promote events</h2>
          <p>
            Organising a party with us is easier and faster. We help you to
            connect with dancers and collaborate with other organisers.
          </p>
        </div>
      </div>
      <div class="mt-16 flex min-w-full justify-start items-center">
        <div class="w-2/3 h-40">
          <h2 class="font-lato font-bold text-xl">Book venues (coming soon)</h2>
          <p>
            Get access to our currated list of studios and open air places
            available for parties or workshops. See availability. Book in few
            clicks with no emails and calls.
          </p>
        </div>
        <div class="w-1/3">
          <TIcon name="undraw_verified" class="pl-4" />
        </div>
      </div>
    </div>

    <div class="mt-8 p-4 max-w-md mx-auto">
      <h2 class="mt-4 mb-10 text-3xl font-montserrat leading-tight text-center">
        WeDance is a non-profit
      </h2>
      <div class="typo">
        <p>
          Our mission is to unite dancers worldwide, so that you can go to any
          city and find dance events and dancers. It all starts with the local
          community and volunteers.
        </p>
        <p>
          WeDance is created and supported by volunteers. Everyone is
          <a href="https://bit.ly/wedance-get-involved" target="_blank"
            >welcome to contribute</a
          >.
        </p>
        <p>
          The project can be much more interesting, if it is launched in all
          cities, then traveling as a dancer will be very easy and pleasant.
          <router-link to="/about">Read more</router-link>.
        </p>
      </div>
    </div>

    <div class="mt-4 bg-dark text-white">
      <TFooter class="p-4 mx-auto max-w-2xl" />
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
  }
}
</script>
