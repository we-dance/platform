<template>
  <div>
    <div>
      <h2 class="font-bold text-xl text-red-500">Oops</h2>
      <div class="text-red-500 mt-4">
        {{ error.message }}
      </div>
      <div v-if="error.code === 'auth/web-storage-unsupported'" class="mt-4">
        Go to your browser Settings -> Site settings -> Cookies and switch the
        setting on. To allow third-party cookies, check the box next to "Allow
        third-party cookies."
      </div>
    </div>
    <div class="border-t mt-4 pt-4">
      If you have any problems please contact support:
      <a
        class="text-blue-500 underline hover:no-underline"
        href="mailto:support@wedance.vip"
        >support@wedance.vip</a
      >.
    </div>
    <TButton allow-guests class="mt-4" type="secondary" @click="tryAgain">
      Try Again
    </TButton>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  setup() {
    const { signOut } = useAuth()

    return {
      signOut,
    }
  },
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    async tryAgain() {
      await this.signOut()
    },
  },
}
</script>
