<template>
  <div>
    <portal to="logo">
      <div class="flex items-center mt-2">
        <div class="font-bold text-3xl">{{ currentCity }}</div>
      </div>
    </portal>

    <div class="bg-dark text-real-white py-16">
      <div class="mt-8 px-4 mx-auto max-w-2xl text-center">
        <h1 class="text-4xl font-bold leading-tight">
          Exclusive content only for dancers
        </h1>
        <p class="mt-2 text-xl">
          Become a member of WeDance Community to get unlimited access to
        </p>
        <ul class="font-bold">
          <li class="inline-block p-2">
            <span class="mr-2">💬</span>Dance Chat
          </li>
          <li class="inline-block p-2">
            <span class="mr-2">🕵️‍♂️</span>Partner Search
          </li>
          <li class="inline-block p-2">
            <span class="mr-2">🗓</span>Events Schedule
          </li>
        </ul>
        <div>
          <TButton class="mt-4 mr-4" type="primary" to="/signin"
            >Join now</TButton
          >
        </div>
      </div>
    </div>

    <div class="mt-8 max-w-2xl mx-auto">
      <div class="px-4 flex content-center justify-center text-center">
        <div class="p-8">
          <div class="text-5xl font-bold">400</div>
          <div class="uppercase">dancers in chat</div>
        </div>
        <div class="p-8">
          <div class="text-5xl font-bold">52</div>
          <div class="uppercase">looking for partner</div>
        </div>
        <div class="p-8">
          <div class="text-5xl font-bold">27</div>
          <div class="uppercase">events this week</div>
        </div>
      </div>
    </div>

    <div class="mt-10 px-4 mx-auto max-w-2xl text-center">
      <p class="text-xl font-bold">
        There are 5 dance events today, 3 september
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
    </div>

    <div class="mt-20"></div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  layout: 'public',
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  },
  computed: {
    currentCity() {
      return this.$route.params.city
    }
  }
}
</script>
