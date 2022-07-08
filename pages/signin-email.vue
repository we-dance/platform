<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else>
    <form class="space-y-4" @submit="submit">
      <TField
        id="email"
        v-model="email"
        type="email"
        :label="$t('account.email')"
        label-position="top"
      />
      <TField
        id="password"
        v-model="password"
        type="password"
        :label="$t('account.password')"
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
        <TButton
          allow-guests
          type="primary"
          class="mt-2 w-full md:mt-0 md:w-32 md:ml-4"
          @click="submit"
        >
          {{ $t('signin.submit') }}
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <NuxtLink to="/register" class="underline hover:no-underline">{{
            $t('signin.register')
          }}</NuxtLink>
          <NuxtLink to="/nopassword" class="underline hover:no-underline">{{
            $t('signin.nopassword')
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
      error,
    } = useAuth()

    return {
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
    loading: {
      handler(val) {
        if (!val && this.profile) {
          this.redirect()
        }
      },
    },
  },
  mounted() {
    if (this.uid) {
      this.redirect()
    }
  },
  methods: {
    redirect() {
      let target = ls('target')
      ls.remove('target')

      if (!target) {
        const page = this.profile?.username || 'onboarding'
        target = '/' + page
      }

      this.$router.push(target)
    },
    async submit(e) {
      e.preventDefault()

      if (!this.email.trim()) {
        return
      }

      track('login', {
        method: 'Password',
      })

      await this.signUserIn(this.email, this.password)
    },
  },
}
</script>
