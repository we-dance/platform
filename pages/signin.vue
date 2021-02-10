<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else>
    <form class="space-y-4" @submit="submit">
      <TField
        id="email"
        v-model="email"
        type="email"
        label="Email"
        label-position="top"
      />
      <TField
        id="password"
        v-model="password"
        type="password"
        label="Password"
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
        <TButton
          type="primary"
          class="mt-2 w-full md:mt-0 md:w-32 md:ml-4"
          @click="submit"
        >
          Login
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <router-link to="/register" class="underline hover:no-underline"
            >Create Account</router-link
          >
          <router-link to="/nopassword" class="underline hover:no-underline"
            >Forgot password</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'

export default {
  name: 'SignInPage',
  layout: 'popup',
  data: () => ({
    email: '',
    password: ''
  }),
  setup() {
    const {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      signUserIn,
      signOut,
      error
    } = useAuth()

    return {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      signUserIn,
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

      this.signUserIn(this.email, this.password)
    }
  }
}
</script>
