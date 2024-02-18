<template>
  <div class="h-[80vh] flex justify-center items-center">
    <div>
      <div class="relative sm:overflow-hidden">
        <div class="relative py-10 lg:p-14 px-4 md:px-8">
          <div class="text-center">
            <h1 class="font-bold text-2xl">
              Travel. Meet. <span class="text-primary">Dance.</span>
            </h1>
            <p>{{ $t('home.cta.description') }}</p>
          </div>

          <div class="max-w-lg mx-auto">
            <TButton
              allow-guests
              :label="$t('home.cta.action')"
              :to="localePath('/explore')"
              type="void"
              class="mt-8 w-full text-gray-900 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-200 rounded-full shadow"
              ><TIcon name="place" class="w-4 h-4 text-primary"
            /></TButton>
          </div>

          <div class="mt-2 max-w-lg text-xs mx-auto text-center sm:max-w-3xl">
            <p>
              {{ $t('hero.submotto') }}.
              <router-link
                class="underline text-primary hover:no-underline"
                to="/about"
                >Our mission</router-link
              >
              is to unite dancers worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
