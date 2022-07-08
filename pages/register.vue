<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else>
    <TForm
      v-model="data"
      allow-guests
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
      </template>
    </TForm>

    <div class="mt-4 text-xs">
      <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
        <NuxtLink to="/signin" class="underline hover:no-underline">{{
          $t('register.login')
        }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import ls from 'local-storage'
import { track } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'

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
      error,
    } = useAuth()

    const { registerFields } = useProfiles()

    const data = ref({})

    return {
      data,
      uid,
      profile,
      loading,
      signingIn,
      createUserWithEmailAndPassword,
      signOut,
      error,
      registerFields,
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
    if (this.$route.query.invitedBy) {
      ls('invitedBy', this.$route.query.invitedBy)
    }

    if (this.$route.query.target) {
      ls('target', this.$route.query.target)
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
      if (
        !email ||
        !email.trim() ||
        !username ||
        !username.trim() ||
        !password ||
        !password.trim()
      ) {
        this.error = {
          message: 'Please fill all the fields',
        }

        return
      }

      track('sign_up', {
        method: 'Password',
      })

      await this.createUserWithEmailAndPassword(
        email,
        password,
        username,
        place
      )
    },
  },
}
</script>
