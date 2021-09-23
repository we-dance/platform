<template>
  <div class="font-noto">
    <main>
      <div class="relative">
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
        <div>
          <div class="relative sm:overflow-hidden">
            <div class="absolute inset-0">
              <nuxt-img
                class="h-full w-full object-cover"
                src="/hero.jpg"
                sizes="sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw"
                alt="People dancing salsa"
              />
              <div class="absolute inset-0 bg-black opacity-50" />
            </div>

            <nav class="relative flex p-4 justify-end">
              <TButton type="simple" to="/signin" :label="$t('signin')" />
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
                  icon="search"
                  label="Search dancers"
                  to="/search"
                  type="void"
                  class="mt-8 w-full text-gray-500 bg-white hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded-full shadow"
                />
              </div>

              <div class="flex justify-center">
                <div class="mt-16 flex space-x-4 font-bold text-white">
                  <div class="flex flex-col items-center justify-center">
                    <TIcon name="group" class="h-16 w-16" />
                    <div class="text-4xl">1068</div>
                    <div class="text-sm">dancers</div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <TIcon name="location" class="h-16 w-16" />
                    <div class="text-4xl">18</div>
                    <div class="text-sm">cities</div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <TIcon name="calendar" class="h-16 w-16" />
                    <div class="text-4xl">120</div>
                    <div class="text-sm">events</div>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-center">
                <TButton
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
    </main>

    <div class="bg-dark text-white">
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
