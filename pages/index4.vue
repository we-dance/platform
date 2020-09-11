<template>
  <div>
    <div class="bg-dark-gradient text-real-white py-16">
      <div class="mt-8 px-4 mx-auto max-w-2xl text-center">
        <h1 class="text-5xl font-bold leading-tight">
          Exclusive for <span class="text-light">Dancers.</span>
        </h1>
        <p class="mt-2 text-xl">
          Salsa, Bachata, Kizomba, Tango, Zouk and more.
        </p>
        <p class="mt-2 text-xl">
          Become a member of WeDance Community to get unlimited access to
        </p>
        <ul class="font-bold">
          <li class="inline-block p-2">
            <span class="mr-2">🗓</span>Event Schedule
          </li>
          <li class="inline-block p-2">
            <span class="mr-2">💬</span>Dance Chat
          </li>
          <li class="inline-block p-2">
            <span class="mr-2">🕵️‍♂️</span
            ><router-link to="/partner" class="underline hover:no-underline"
              >Partner Search</router-link
            >
          </li>
        </ul>
        <div>
          <TButton class="mt-4 mr-4" type="primary" to="/signin"
            >Join now</TButton
          >
        </div>
      </div>
    </div>

    <portal to="top-left">
      <TInputLocationSelect
        class="ml-2"
        :value="currentCity"
        @input="selectCity"
      />
    </portal>

    <div v-if="currentCity">
      <div class="mt-16 max-w-2xl mx-auto">
        <div class="px-4 grid gap-4 grid-cols-3 text-center">
          <div>
            <div class="text-3xl font-bold">27</div>
            <div class="">events this week</div>
          </div>
          <div>
            <div class="text-3xl font-bold">400</div>
            <div class="">dancers in chat</div>
          </div>
          <div>
            <div class="text-3xl font-bold">52</div>
            <div class="">looking for partner</div>
          </div>
        </div>
      </div>

      <div
        class="border rounded mx-4 mt-16 p-4 md:mx-auto max-w-2xl text-center"
      >
        <p class="text-xl font-bold leading-tight">
          There are 5 dance events today, 4th of september
        </p>
        <ul class="p-4 text-left list-disc">
          <li>
            <span class="font-bold">19:00 🎉 </span>
            <router-link
              class="underline hover:no-underline text-blue-700"
              to="/SalsaCubanaMunich"
            >
              Salsa Cubana at Pinathek der Moderne</router-link
            >
          </li>
          <li class="leading-tight">
            Other 4 events are visible only for members<sup class="text-primary"
              >*</sup
            ><br /><span class="text-xs"
              ><span class="text-primary">*</span> – some organisers restrict
              visibility to avoid too much exposure</span
            >
          </li>
        </ul>
        <div>
          Full weekly schedule is available for members only.
          <router-link
            class="underline hover:no-underline text-blue-700"
            to="/signin"
            >Sign in</router-link
          >.
        </div>
      </div>
    </div>

    <div v-else>
      <div class="mt-16 max-w-2xl mx-auto text-center">
        <div>Select city to see more information.</div>
        <div class="flex justify-center mt-2">
          <TInputLocationSelect
            class="ml-2"
            :value="currentCity"
            @input="selectCity"
          />
        </div>
      </div>
    </div>

    <div class="mt-16"></div>
  </div>
</template>

<script>
export default {
  layout: 'public',
  data: () => ({
    currentCity: ''
  }),
  mounted() {
    if (!this.$route.query.city) {
      return
    }

    this.currentCity = {
      locality: this.$route.query.city
    }
  },
  methods: {
    selectCity(val) {
      this.currentCity = val
    }
  }
}
</script>
