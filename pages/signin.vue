<template>
  <TLoader v-if="loading || signingIn" />
  <div v-else>
    <TAuthHeader />
    <form class="space-y-4 p-4" @submit="submit">
      <TField
        id="email"
        v-model="email"
        required
        type="email"
        :label="$t('account.email')"
        label-position="top"
      />
      <TField
        id="password"
        v-model="password"
        required
        type="password"
        :label="$t('account.password')"
        label-position="top"
      />
      <NuxtLink
        :to="localePath('/nopassword')"
        class="underline hover:no-underline"
        >{{ $t('signin.nopassword') }}</NuxtLink
      >

      <div class="mt-4 text-xs">
        <i18n path="agreement" tag="p">
          <template v-slot:privacy>
            <NuxtLink
              class="underline hover:no-underline"
              :to="localePath('/privacy')"
              >{{ $t('privacy') }}</NuxtLink
            >
          </template>
          <template v-slot:terms>
            <NuxtLink
              class="underline hover:no-underline"
              :to="localePath('/terms')"
              >{{ $t('terms') }}</NuxtLink
            >
          </template>
        </i18n>
      </div>
      <div class="mt-4 flex justify-end">
        <TButton
          allow-guests
          type="primary"
          xtype="submit"
          class="mt-2 w-full md:mt-0 md:w-32 md:ml-4"
          @click="submit"
        >
          {{ $t('signin.submit') }}
        </TButton>
      </div>
      <TAuthError v-if="error" :error="error" />
    </form>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useAuth } from '~/use/auth'

export default {
  name: 'SignInPage',
  layout: 'popup',
  data: () => ({
    email: '',
    password: '',
  }),
  setup() {
    const {
      uid,
      profile,
      loading,
      signingIn,
      signInWithGoogle,
      signUserIn,
      signOut,
      profileLoaded,
      error,
    } = useAuth()

    const isRedirecting = ref(false)

    return {
      profileLoaded,
      isRedirecting,
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      signUserIn,
      signOut,
      error,
      profile,
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
    async submit(e) {
      e.preventDefault()

      if (!this.email.trim()) {
        return
      }

      this.$track('login', {
        method: 'Password',
      })

      await this.signUserIn(this.email, this.password)
    },
  },
}
</script>
