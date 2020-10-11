<template>
  <div
    class="bg-dark-gradient text-real-white flex-grow flex items-center justify-center"
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
          <TInputCity v-model="currentCity" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useCities from '~/use/cities'

export default {
  layout: 'minimal',
  setup() {
    const { currentCity } = useCities()

    return {
      currentCity
    }
  }
}
</script>
