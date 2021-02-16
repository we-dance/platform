<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else>
    <form class="space-y-4" @submit="submit">
      <TField
        id="username"
        v-model="username"
        :label="$t('profile.username')"
        type="username"
        required
        label-position="top"
      />
      <TField
        id="email"
        v-model="email"
        type="email"
        :label="$t('account.email')"
        required
        label-position="top"
      />
      <TField
        id="password"
        v-model="password"
        type="password"
        :label="$t('account.password')"
        required
        label-position="top"
      />
      <TField
        v-model="community"
        :label="$t('profile.community')"
        label-position="vertical"
        type="city"
      />

      <div class="mt-4 text-xs">
        <i18n path="agreement" tag="p">
          <template v-slot:privacy>
            <router-link class="underline hover:no-underline" to="/privacy">{{
              $t('privacy')
            }}</router-link>
          </template>
          <template v-slot:terms>
            <router-link class="underline hover:no-underline" to="/terms">{{
              $t('terms')
            }}</router-link>
          </template>
        </i18n>
      </div>
      <div class="mt-4 flex justify-end">
        <TButton
          type="primary"
          class="mt-2 w-full md:mt-0 md:w-32 md:ml-4"
          @click="submit"
        >
          {{ $t('register.submit') }}
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <router-link to="/signin" class="underline hover:no-underline">{{
            $t('register.login')
          }}</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'

export default {
  name: 'RegisterPage',
  layout: 'popup',
  data: () => ({
    email: '',
    password: '',
    username: '',
    community: ''
  }),
  setup() {
    const {
      uid,
      loading,
      profile,
      signingIn,
      createUserWithEmailAndPassword,
      signOut,
      error
    } = useAuth()

    return {
      uid,
      profile,
      loading,
      signingIn,
      createUserWithEmailAndPassword,
      signOut,
      error
    }
  },
  watch: {
    loading: {
      handler(val) {
        if (!val && this.profile) {
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

    this.community = ls('city')

    if (this.uid) {
      this.redirect()
    }
  },
  methods: {
    redirect() {
      this.$router.push(`/${this.username}`)
    },
    async submit(e) {
      e.preventDefault()

      if (
        !this.email.trim() ||
        !this.username.trim() ||
        !this.password.trim()
      ) {
        this.error = {
          message: 'Please fill all the fields'
        }

        return
      }

      this.$fire.analytics.logEvent('sign_up', {
        method: 'Password'
      })

      this.$fire.analytics.logEvent('join_group', {
        group_id: this.community
      })

      await this.createUserWithEmailAndPassword(
        this.email,
        this.password,
        this.username,
        this.community
      )
    }
  }
}
</script>
