<template>
  <div>
    <nav
      class="mx-auto max-w-2xl mt-4 mb-4 px-4 flex justify-between items-center"
    >
      <div>
        <TIcon name="logo-horizontal-dark" />
      </div>
      <div>
        <TButton type="secondary" to="/signin" label="Login" />
      </div>
    </nav>

    <div class="py-16">
      <div class="px-4 mx-auto max-w-2xl text-center">
        <TIcon name="undraw_i_can_fly" class="mb-4" />
        <h1 class="text-4xl leading-tight font-montserrat font-bold">
          Do you like to dance?
        </h1>
        <p class="mt-2 text-xl font-lato">
          Meet dance partners and help each other to find interesting dance
          events.
        </p>
        <div>
          <TButton class="mt-4 mr-4" type="primary" to="/register"
            >Join community</TButton
          >
        </div>
      </div>
    </div>

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
