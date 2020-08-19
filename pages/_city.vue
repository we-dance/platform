<template>
  <div>
    <div class="bg-hero">
      <div class="bg-black bg-opacity-75">
        <div class="text-white py-40 px-4 mx-auto max-w-2xl">
          <h1 class="text-4xl font-serif leading-tight">
            Dance community in {{ citySelected }}
          </h1>
          <p class="mt-2 text-xl leading-tight">
            Salsa, Bachata, Kizomba, Tango, Zouk and more!
          </p>
          <p class="text-xl leading-tight">
            Connect with dancers and plan activities easier.
          </p>
          <div class="flex">
            <TButton class="mt-4 mr-4" type="primary" to="/signin"
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
      <h2 class="mt-8 mb-10 text-3xl font-serif leading-tight text-center">
        We help you with your dance journey
      </h2>
      <div>
        <div class="flex my-20 flex-row ">
          <div class="w-1/2 flex justify-center align-middle">
            <TIcon class="w-32" name="undraw_i_can_fly" />
          </div>
          <div class="px-8 flex items-center">
            <div>
              <h2 class="font-bold text-xl">Start dancing</h2>
              <p>
                Discover all dance styles in your city, find your passion, get
                inspired and plan your first workshop.
              </p>
            </div>
          </div>
        </div>

        <div class="flex my-20 flex-row-reverse">
          <div class="w-1/2 flex justify-center align-middle">
            <TIcon class="w-32" name="undraw_together" />
          </div>
          <div class="px-8 flex items-center">
            <div>
              <h2 class="font-bold text-xl">Find dance partner</h2>
              <p>
                Let us know who you are looking for and we will recommend you
                someone.
              </p>
            </div>
          </div>
        </div>

        <div class="flex my-20 flex-row">
          <div class="w-1/2 flex justify-center align-middle">
            <TIcon class="w-32" name="undraw_events" />
          </div>
          <div class="px-8 flex items-center">
            <div>
              <h2 class="font-bold text-xl">Find parties</h2>
              <p>
                We monitor all activities in dance scene and provide you with
                event calendar, which will highlight the best party for you.
              </p>
            </div>
          </div>
        </div>

        <div class="flex my-20 flex-row-reverse">
          <div class="w-1/2 flex justify-center align-middle">
            <TIcon class="w-32" name="undraw_super_woman" />
          </div>
          <div class="px-8 flex items-center">
            <div>
              <h2 class="font-bold text-xl">Improve dancing</h2>
              <p>
                Find and connect with dance instructors, dance schools and
                festivals.
              </p>
            </div>
          </div>
        </div>

        <div class="flex my-20 flex-row">
          <div class="w-1/2 flex justify-center align-middle">
            <TIcon class="w-32" name="undraw_compose_music" />
          </div>
          <div class="px-8 flex items-center">
            <div>
              <h2 class="font-bold text-xl">Share your passion</h2>
              <p>
                Share your dance story and inspire others! We offer
                collaborative youtube, twitter and instagram channels and aiming
                to bring more creators talk about dance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 pb-8 my-16 max-w-2xl mx-auto">
      <div class="my-6 text-3xl font-serif leading-tight text-center">
        Join chat with 300+ dancers
      </div>
      <div class="flex justify-center">
        <TButton type="primary" to="/signin">Join now</TButton>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  name: 'PostsIndex',
  layout: 'static',
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
