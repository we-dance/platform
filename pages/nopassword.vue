<template>
  <TLoader v-if="loading || signingIn" />
  <div v-else-if="emailSent" class="typo p-4">
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
    <form class="space-y-4 p-4" @submit="submit">
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
        <TButton allow-guests type="primary" @click="submit">
          Reset Password
        </TButton>
      </div>
      <TAuthError v-if="error" :error="error" />
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <NuxtLink
            :to="localePath('/register')"
            class="underline hover:no-underline"
            >{{ $t('signin.register') }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/signin')"
            class="underline hover:no-underline"
            >{{ $t('nopassword.signin') }}</NuxtLink
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
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
      sendPasswordResetEmail,
      signOut,
      error,
      profile,
    } = useAuth()

    return {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      sendPasswordResetEmail,
      signOut,
      error,
      profile,
    }
  },
  methods: {
    async submit(e) {
      e.preventDefault()

      if (!this.email.trim()) {
        return
      }

      track('reset-password')

      if (await this.sendPasswordResetEmail(this.email.trim())) {
        this.emailSent = true
      }
    },
  },
}
</script>
