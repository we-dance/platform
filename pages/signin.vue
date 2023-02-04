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

    <div class="w-48 text-center text-xs">
      By continuing you agree to WeDance's
      <router-link class="underline" to="/terms">Terms of Service</router-link>
      and have read the
      <router-link class="underline" to="/privacy">Privacy Policy</router-link>.
    </div>
  </div>
</template>

<script>
import ls from 'local-storage'
import { ref } from 'vue-demi'
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
      profileLoaded,
      error,
    } = useAuth()

    const isRedirecting = ref(false)

    return {
      isRedirecting,
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      signInWithFacebook,
      signUserIn,
      signOut,
      error,
      profile,
      profileLoaded,
    }
  },
  watch: {
    loading: 'redirect',
    profileLoaded: 'redirect',
  },
  mounted() {
    if (this.$route.query.invitedBy) {
      ls('invitedBy', this.$route.query.invitedBy)
    }

    if (this.$route.query.target) {
      const target = this.$route.query.target

      ls('target', target)
    }

    this.redirect()
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
      if (this.isRedirecting) {
        return
      }

      this.isRedirecting = true

      if (this.loading) {
        this.isRedirecting = false
        return
      }

      if (this.profileLoaded && !this.profile?.username) {
        this.$router.push('/onboarding')
        return
      }

      if (!this.uid) {
        this.isRedirecting = false
        return
      }

      if (!this.profileLoaded) {
        this.isRedirecting = false
        return
      }

      let target = ls('target')
      ls.remove('target')

      if (!target) {
        const page = this.profile?.username
        target = '/' + page
      }

      this.$router.push(target)
    },
  },
}
</script>
