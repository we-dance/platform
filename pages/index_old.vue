<template>
  <div
    v-if="!city"
    class="bg-dark-gradient text-white flex-grow flex items-center justify-center"
  >
    <div class="p-4 mx-auto max-w-2xl text-center">
      <h1 class="text-5xl font-bold leading-tight">
        Exclusive for
        <span class="text-light">Dancers.</span>
      </h1>
      <p class="mt-2 text-xl">
        Salsa, Bachata, Kizomba, Tango, Zouk and more.
      </p>
      <div class="text-black mt-4 flex justify-center text-xl">
        <div>
          <TInputCity v-model="currentCity" hide-global />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-4 mx-auto max-w-xl mb-16">
    <TPopup v-if="showAuthPopup">
      <div class="flex justify-between border-b pb-2 mb-4">
        <div class="font-bold">Members only</div>
        <button class="cursor-pointer" @click="showAuthPopup = false">
          <TIcon name="close" class="cursor-pointer w-4 h-4" />
        </button>
      </div>
      <div class="my-4 flex flex-col justify-center">
        <div>Chat is available only for members</div>
        <TButton class="mt-2" to="/signin?target=/">Become Member</TButton>
      </div>
    </TPopup>

    <h1 class="font-bold text-4xl">Welcome to {{ city.name }}!</h1>

    <div class="my-4 space-y-2">
      <div v-if="city && city.telegram">
        <TButton v-if="uid" :href="city.telegram" class="flex items-center">
          <TIcon name="telegram" class="w-4 h-4 text-black mr-2" />
          Join {{ city.name }} Dance Chat
        </TButton>
        <TButton
          v-else
          class="flex items-center w-full"
          @click="showAuthPopup = true"
        >
          <TIcon name="telegram" class="w-4 h-4 text-black mr-2" />
          Join {{ city.name }} Dance Chat
        </TButton>
      </div>

      <div>
        <TButton to="/feed" class="flex items-center">
          <TIcon name="news" class="w-4 h-4 text-black mr-2" />
          Discuss dance topics
        </TButton>
      </div>

      <div>
        <TButton to="/community" class="flex items-center">
          <TIcon name="friends" class="w-4 h-4 text-black mr-2" />
          Find dance partners
        </TButton>
      </div>

      <div>
        <TButton to="/events" class="flex items-center">
          <TIcon name="calendar" class="w-4 h-4 text-black mr-2" />
          Discover workshops and parties
        </TButton>
      </div>
    </div>
  </div>
</template>

<script>
import useCities from '~/use/cities'
import useAuth from '~/use/auth'

export default {
  layout: 'minimal',
  data: () => ({
    showAuthPopup: false
  }),
  setup() {
    const { currentCity, city } = useCities()
    const { uid } = useAuth()

    return {
      currentCity,
      city,
      uid
    }
  }
}
</script>
