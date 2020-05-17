<template>
  <div class="container mx-auto md:max-w-lg md:mb-16">
    <main class="card">
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
import TLoader from '~/components/TLoader'
import useAuth from '~/use/auth'
import TButton from '~/components/TButton'
import TIcon from '~/components/TIcon'

export default {
  components: {
    TLoader,
    TButton,
    TIcon
  },
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
            target = '/'
          }

          this.$router.push(target)
        }
      }
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
