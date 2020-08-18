<template>
  <div class="font-sans leading-normal tracking-normal antialiased">
    <header class="container mx-auto bg-white">
      <div class="flex items-center justify-between flex-wrap p-4">
        <div class="flex items-center justify-start">
          <router-link to="/" class="flex items-center">
            <TIcon class="w-6 h-6 mt-2 mr-2" name="icon" />
            <TIcon class="h-4 w-32" name="logo-text" />
          </router-link>
        </div>
        <TButton v-if="uid" class="mt-4" type="secondary" to="/feed"
          >Open</TButton
        >
        <TButton v-else class="mt-4" type="secondary" to="/signin"
          >Log in</TButton
        >
      </div>
    </header>

    <div class="bg-hero">
      <div class="bg-black bg-opacity-75">
        <div class="text-white py-40 px-4 mx-auto max-w-2xl">
          <h1 class="text-4xl font-serif leading-tight">
            Dance community in
            <div class="inline-block text-black">
              <TInputSelect
                :options="cityList"
                :value="citySelected"
                @input="(city) => $router.push(`/${city}`)"
              />
            </div>
          </h1>
          <p class="mt-2 text-xl leading-tight">
            Salsa, Bachata, Kizomba, Tango, Zouk and more!
          </p>
          <p class="text-xl leading-tight">
            Connect with dancers and plan activities easier.
          </p>
          <div class="md:flex text-center">
            <TButton class="mt-4 md:mr-4" type="primary" to="/signin"
              >Join now</TButton
            >
            <TButton
              class="mt-4"
              type="secondary"
              href="https://www.notion.so/WeDance-d8a81e56732e4c10958073a8b887a673"
              >About WeDance</TButton
            >
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 max-w-2xl mx-auto">
      <h2 class="mt-4 mb-10 text-3xl font-serif leading-tight text-center">
        We help you with your dance journey
      </h2>
      <div class="mt-4 flex min-w-full justify-end">
        <div class="w-1/3">
          <TIcon name="undraw_i_can_fly" class="pr-4" />
        </div>
        <div class="w-2/3 h-40">
          <h2 class="font-bold text-xl">Start dancing</h2>
          <p>
            Discover all dance styles in your city, find your passion, get
            inspired and plan your first workshop.
          </p>
        </div>
      </div>
      <div class="mt-4 flex min-w-full justify-start">
        <div class="w-2/3 h-40">
          <h2 class="font-bold text-xl">Find dance partner</h2>
          <p>
            Let us know who you are looking for and we will recommend you
            someone.
          </p>
        </div>
        <div class="w-1/3">
          <TIcon name="undraw_together" class="pl-4" />
        </div>
      </div>
      <div class="mt-4 flex min-w-full justify-end">
        <div class="w-1/3">
          <TIcon name="undraw_events" class="pr-4" />
        </div>
        <div class="w-2/3 h-40">
          <h2 class="font-bold text-xl">Find parties</h2>
          <p>
            We monitor all activities in dance scene and provide you with event
            calendar, which will highlight the best party for you.
          </p>
        </div>
      </div>
      <div class="mt-4 flex min-w-full justify-start">
        <div class="w-2/3 h-40">
          <h2 class="font-bold text-xl">Improve dancing</h2>
          <p>
            Find and connect with dance instructors, dance schools and
            festivals.
          </p>
        </div>
        <div class="w-1/3">
          <TIcon name="undraw_super_woman" class="pl-4" />
        </div>
      </div>

      <div class="mt-4 flex min-w-full justify-end">
        <div class="w-1/3">
          <TIcon name="undraw_online_ad" class="pr-4" />
        </div>
        <div class="w-2/3 h-40">
          <h2 class="font-bold text-xl">Promote events</h2>
          <p>
            Organising a party with us is easier and faster. We help you to
            connect with dancers and collaborate with other organisers.
          </p>
        </div>
      </div>
      <div class="mt-4 flex min-w-full justify-start">
        <div class="w-2/3 h-40">
          <h2 class="font-bold text-xl">Book venues</h2>
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

    <div class="p-4 max-w-2xl mx-auto">
      <div class="my-6 text-3xl font-serif leading-tight text-center">
        Join chat with 300+ dancers
      </div>
      <div class="flex justify-center">
        <TButton type="primary" to="/signin">Join now</TButton>
      </div>
    </div>

    <div class="mt-8 bg-black text-white text-sm">
      <div class="p-4 container mx-auto">
        <p>Connect with us and hit up #wedance</p>
        <p>© WeDance 2020</p>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  name: 'PostsIndex',
  layout: 'empty',
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  },
  computed: {
    cityList() {
      return [
        {
          value: '',
          label: 'Your city'
        },
        {
          value: 'Munich',
          label: 'Munich'
        },
        {
          value: 'new',
          label: 'New city'
        }
      ]
    },
    citySelected() {
      return this.$route.params.city
    }
  }
}
</script>
