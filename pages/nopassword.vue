<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else-if="emailSent" class="typo">
    <h2>Check your email</h2>
    <p>Email might come in 5-10 minutes and might land in spam.</p>
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
        :label="$t('account.email')"
        label-position="top"
      />

      <div class="mt-4 text-xs">
        <i18n path="agreement" tag="p">
          <template v-slot:privacy>
            <NuxtLink class="underline hover:no-underline" to="/privacy">{{
              $t('privacy')
            }}</NuxtLink>
          </template>
          <template v-slot:terms>
            <NuxtLink class="underline hover:no-underline" to="/terms">{{
              $t('terms')
            }}</NuxtLink>
          </template>
        </i18n>
      </div>
      <div class="mt-4 flex justify-end">
        <TButton allow-guests type="primary" @click="submit">
          {{ $t('nopassword.submit') }}
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <NuxtLink to="/register" class="underline hover:no-underline">{{
            $t('signin.register')
          }}</NuxtLink>
          <NuxtLink to="/signin-email" class="underline hover:no-underline">{{
            $t('nopassword.signin')
          }}</NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ls from 'local-storage'
import { track } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  name: 'NoPasswordPage',
  layout: 'popup',
  data: () => ({
    email: '',
    emailSent: false,
  }),
  setup() {
    const {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      sendSignInLinkToEmail,
      signOut,
      error,
      profile,
    } = useAuth()

    return {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      sendSignInLinkToEmail,
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
    redirect() {
      let target = ls('target')

      if (!target) {
        target = '/events'
      }

      this.$router.push(target)
    },
    async submit(e) {
      e.preventDefault()

      if (!this.email.trim()) {
        return
      }

      track('login', {
        method: 'NoPassword',
      })

      await this.sendSignInLinkToEmail(this.email)
      this.emailSent = true
    },
  },
}
</script>
