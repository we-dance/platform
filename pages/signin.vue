<template>
  <div class="flex items-center justify-center h-screen bg-gray-300">
    <main class="rounded bg-white mb-4 shadow border p-8">
      <router-link to="/">
        <TIcon name="logo" class="mb-4" />
      </router-link>
      <div v-if="error">
        <div class="typo">
          <h2>Oops</h2>
          <p class="text-brand-fail">{{ error }}</p>
        </div>
        <TButton type="secondary" @click="signOut">
          Try Again
        </TButton>
      </div>
      <TLoader v-else-if="loading || signingIn" />
      <div v-else>
        <div class="typo">
          <h2>Sign in with</h2>
        </div>
        <div class="text-center">
          <TButton
            class="w-full flex items-center justify-center"
            @click="signInWithGoogle"
          >
            <TIcon name="google" />
            Google
          </TButton>
        </div>
        <div class="pt-4 text-sm text-center">
          We require social login to prevent abuse.
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'

export default {
  layout: 'empty',
  data: () => ({
    email: '',
    emailSent: false
  }),
  setup() {
    const {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      sendSignInLinkToEmail,
      signOut,
      error
    } = useAuth()

    return {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      sendSignInLinkToEmail,
      signOut,
      error
    }
  },
  watch: {
    uid: {
      handler(val) {
        if (val) {
          let target = ls('target')
          ls.remove('target')

          if (!target) {
            target = '/feed'
          }

          this.$router.push(target)
        }
      }
    }
  },
  mounted() {
    const target = this.$route.query.target
    if (target) {
      ls('target', target)
    }
  },
  methods: {
    submit(e) {
      e.preventDefault()

      this.sendSignInLinkToEmail(this.email)
      this.emailSent = true
    }
  }
}
</script>
