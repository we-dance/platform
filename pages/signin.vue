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
      <div v-else-if="emailSent" class="typo">
        <h2>Almost there</h2>
        <p>Check your email and click the invitation link.</p>
        <p class="text-brand-fail">
          We currently do not support web.de emails.
        </p>
        <p>
          We are in beta now, please report if you have any issues to
          <a href="mailto:moneydo@razbakov.com">moneydo@razbakov.com</a> and we
          will fix them ASAP.
        </p>
      </div>
      <div v-else>
        <div class="typo">
          <h2>Sign in with</h2>
        </div>
        <div class="text-center">
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
            placeholder="name@email.com"
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
    </main>
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
  layout: 'static',
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
    submit(e) {
      e.preventDefault()

      this.sendSignInLinkToEmail(this.email)
      this.emailSent = true
    }
  }
}
</script>
