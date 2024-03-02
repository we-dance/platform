<template>
  <div class="px-4">
    <h2 class="text-center text-xl font-bold">
      {{ $t('home.numbers.title') }}
    </h2>
    <div class="mt-4 grid grid-cols-3 gap-4 max-w-4xl mx-auto">
      <div class="p-4 space-y-1 bg-light rounded shadow">
        <h3 class="text-2xl font-extrabold text-center">
          {{ numbers ? numbers.countries : '...' }}
        </h3>
        <p class="text-center text-xs">
          {{ $t('home.numbers.countries') }}
        </p>
      </div>
      <div class="p-4 space-y-1 bg-light rounded shadow">
        <h3 class="text-2xl font-extrabold text-center">
          {{ numbers ? numbers.profiles : '...' }}
        </h3>
        <p class="text-center text-xs">
          {{ $t('home.numbers.profiles') }}
        </p>
      </div>
      <div class="p-4 space-y-1 bg-light rounded shadow">
        <h3 class="text-2xl font-extrabold text-center">
          {{ numbers ? numbers.events : '...' }}
        </h3>
        <p class="text-center text-xs">
          {{ $t('home.numbers.events') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'

export default {
  name: 'Index',
  layout: 'default',
  setup() {
    const numbers = ref({})

    numbers.value = {
      profiles: 2680,
      events: 452,
      countries: 54,
    }

    return { numbers }
  },
}
</script>
