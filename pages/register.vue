<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else>
    <TForm
      v-model="data"
      :fields="registerFields"
      :field-config="{ labelPosition: 'top' }"
      class="space-y-4"
      :submit-label="$t('register.submit')"
      @save="submit"
    >
      <template v-slot:bottom>
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
      </template>
    </TForm>

    <div class="mt-4 text-xs">
      <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
        <router-link to="/signin" class="underline hover:no-underline">{{
          $t('register.login')
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { useAuth } from '~/use/auth'
import { registerFields } from '~/use/profiles'

export default {
  name: 'RegisterPage',
  layout: 'popup',
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

    const data = ref({ password: '', email: '', username: '', place: '' })

    return {
      data,
      uid,
      profile,
      loading,
      signingIn,
      createUserWithEmailAndPassword,
      signOut,
      error,
      registerFields
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

    this.$set(this.data, 'place', ls('city'))

    if (this.uid) {
      this.redirect()
    }
  },
  methods: {
    redirect() {
      this.$router.push(`/${this.profile.username}`)
    },
    async submit({ email, username, password, place }) {
      this.$fire.analytics.logEvent('sign_up', {
        method: 'Password'
      })

      await this.createUserWithEmailAndPassword(
        email,
        password,
        username,
        place
      )
    }
  }
}
</script>
