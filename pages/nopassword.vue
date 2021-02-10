<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else-if="emailSent" class="typo">
    <h2>Check your email</h2>
    <p>
      Email might come in 5-10 minutes and might land in spam.
    </p>
    <p>
      Please report if you have any issues to
      <a
        class="text-blue-500 underline hover:no-underline"
        href="mailto:support@wedance.vip"
        >support@wedance.vip</a
      >.
    </p>
  </div>
  <div v-else>
    <form @submit="submit">
      <TField
        id="email"
        v-model="email"
        type="email"
        label="Email"
        label-position="top"
      />

      <div class="mt-4 text-xs">
        By signing in, you agree to
        <router-link class="underline hover:no-underline" to="/terms"
          >Terms of service</router-link
        >
        and
        <router-link class="underline hover:no-underline" to="/privacy"
          >Privacy policy</router-link
        >.
      </div>
      <div class="mt-4 flex justify-end">
        <TButton type="primary" @click="submit">
          Send a magic link
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <router-link to="/signin" class="underline hover:no-underline"
            >I have a password</router-link
          >
          <button
            class="underline hover:no-underline"
            @click="signInWithGoogle"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'

export default {
  layout: 'popup',
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
          this.redirect()
        }
      }
    }
  },
  mounted() {
    const target = this.$route.query.target

    if (target) {
      ls('target', target)
    }

    if (this.uid) {
      this.redirect()
    }
  },
  methods: {
    redirect() {
      let target = ls('target')
      ls.remove('target')

      if (!target) {
        target = '/'
      }

      this.$router.push(target)
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
