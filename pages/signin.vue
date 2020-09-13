<template>
  <div>
    <div class="flex justify-center mb-8">
      <router-link to="/" class="flex items-center">
        <TIcon class="w-6 h-6 mt-2 mr-2" name="icon" />
        <TIcon class="h-4 w-32" name="logo-text" />
      </router-link>
    </div>
    <div v-if="error">
      <div class="typo">
        <h2>Oops</h2>
        <p class="text-brand-fail">{{ error }}</p>
      </div>
      <p>
        Please contact support:
        <a href="mailto:support@wedance.vip">support@wedance.vip</a>.
      </p>
      <TButton type="secondary" @click="reload">
        Try Again
      </TButton>
    </div>
    <TLoader v-else-if="loading || signingIn" />
    <div v-else-if="emailSent" class="typo">
      <h2>Check your email</h2>
      <p class="text-xs">
        Email might come in 5-10 minutes and might land in spam.
      </p>
      <p class="text-xs">
        Please report if you have any issues to
        <a href="mailto:support@wedance.vip">support@wedance.vip</a>.
      </p>
    </div>
    <div v-else>
      <h2 class="font-bold mb-2">Sign in with</h2>
      <div class="flex justify-center">
        <TButton
          class="flex items-center justify-center"
          @click="signInWithGoogle"
        >
          <TIcon name="google" />
          Google
        </TButton>
      </div>
      <div class="divider">or</div>
      <form class="md:flex items-end" @submit="submit">
        <TField
          v-model="email"
          type="email"
          label="Email"
          label-position="top"
        />
        <TButton
          type="primary"
          class="mt-2 w-full md:mt-0 md:w-32 md:ml-4"
          @click="submit"
        >
          {{ $t('auth.signin') }}
        </TButton>
      </form>
    </div>
  </div>
</template>

<script>
import ls from 'local-storage'
import TLoader from '~/components/TLoader'
import useAuth from '~/use/auth'
import TButton from '~/components/TButton'
import TIcon from '~/components/TIcon'
import TField from '~/components/TField'

export default {
  layout: 'popup',
  components: {
    TLoader,
    TButton,
    TIcon,
    TField
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
            target = '/feed'
          }

          this.$router.push(target)
        }
      }
    }
  },
  methods: {
    async reload() {
      await this.signOut()
    },
    submit(e) {
      e.preventDefault()

      if (!this.email.trim()) {
        return
      }

      this.sendSignInLinkToEmail(this.email)
      this.emailSent = true
    }
  }
}
</script>
