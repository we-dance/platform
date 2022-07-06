<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else class="flex flex-col space-y-2">
    <TButton
      v-if="$route.query.beta"
      :label="$t('nopassword.facebook')"
      allow-guests
      icon="facebook"
      @click="signFacebook"
    />
    <TButton
      :label="$t('nopassword.google')"
      allow-guests
      icon="google"
      @click="signGoogle"
    />
    <TButton allow-guests :label="$t('nopassword.email')" to="/nopassword" />
  </div>
</template>

<script>
import ls from 'local-storage'
import { track } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  name: 'SignInPage',
  layout: 'popup',
  setup() {
    const {
      uid,
      profile,
      loading,
      signingIn,
      signInWithGoogle,
      signInWithFacebook,
      signUserIn,
      signOut,
      error,
    } = useAuth()
    return {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      signInWithFacebook,
      signUserIn,
      signOut,
      error,
      profile,
    }
  },
  watch: {
    loading: {
      handler(val) {
        if (!val && this.profile) {
          this.redirect()
        }
      },
    },
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
    async signFacebook() {
      track('login', {
        method: 'Facebook',
      })

      await this.signInWithFacebook()
    },
    async signGoogle() {
      track('login', {
        method: 'Google',
      })

      await this.signInWithGoogle()
    },
    redirect() {
      let target = ls('target')
      ls.remove('target')
      if (!target) {
        const page = this.profile?.username || 'onboarding'
        target = '/' + page
      }
      this.$router.push(target)
    },
  },
}
</script>
