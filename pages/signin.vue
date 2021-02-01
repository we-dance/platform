<template>
  <div v-if="error">
    <div class="typo">
      <h2>Oops</h2>
      <p class="text-red-500">
        <span class="font-bold">Error:</span> {{ error.message }}
      </p>
      <p v-if="error.code === 'auth/web-storage-unsupported'">
        Go to your browser Settings -> Site settings -> Cookies and switch the
        setting on. To allow third-party cookies, check the box next to "Allow
        third-party cookies."
      </p>
    </div>
    <p>
      Please contact support:
      <a
        class="text-blue-500 underline hover:no-underline"
        href="mailto:support@wedance.vip"
        >support@wedance.vip</a
      >.
    </p>
    <TButton class="mt-4" type="secondary" @click="reload">
      Try Again
    </TButton>
  </div>
  <TLoader v-else-if="loading || signingIn" />
  <div v-else-if="emailSent" class="typo">
    <h2>Check your email</h2>
    <p>
      Email might come in 5-10 minutes and might land in spam.
    </p>
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
    <TPopup
      v-if="noPasswordPopup"
      title="How to login without password?"
      @close="noPasswordPopup = false"
    >
      <div class="p-4">
        <p>
          Use login and leave password field empty and we will send a magic link
          to your inbox.
        </p>
        <p class="mt-4">
          To change password go to Settings → Account → Change password.
        </p>
      </div>

      <div class="flex justify-end">
        <TButton @click="noPasswordPopup = false">Close</TButton>
      </div>
    </TPopup>
    <TTabs v-model="tab" :tabs="tabs" />
    <form class="mt-4" @submit="submit">
      <TField
        v-if="tab === 'register'"
        id="username"
        v-model="username"
        label="Username"
        label-position="top"
        class="mt-4"
      />
      <TField
        id="email"
        v-model="email"
        type="email"
        label="Email"
        label-position="top"
        class="mt-4"
      />
      <TField
        id="password"
        v-model="password"
        type="password"
        label="Password"
        label-position="top"
        class="mt-4"
      />
      <TField
        v-if="tab === 'register'"
        v-model="community"
        label="I dance in"
        label-position="vertical"
        type="city"
        class="mt-4"
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
          {{ tab === 'login' ? 'Login' : 'Register' }}
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <p v-if="tab === 'login'">
          Don't have an account yet?
          <button
            class="underline hover:no-underline"
            @click="tab = 'register'"
          >
            Register</button
          >.
        </p>
        <p v-if="tab === 'login'">
          Forgot password or don't have one?
          <button
            class="underline hover:no-underline"
            @click="noPasswordPopup = true"
          >
            How to login?</button
          >.
        </p>
        <p v-if="tab === 'register'">
          Already have an account?
          <button class="underline hover:no-underline" @click="tab = 'login'">
            Login</button
          >.
        </p>
        <div class="mt-4 border-t pt-4">
          <button
            class=" text-xs underline hover:no-underline"
            @click="signInWithGoogle"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'

export default {
  layout: 'popup',
  data: () => ({
    email: '',
    password: '',
    username: '',
    community: '',
    emailSent: false,
    noPasswordPopup: false,
    tab: 'login',
    tabs: [
      {
        value: 'login',
        label: 'Log in'
      },
      {
        value: 'register',
        label: 'Register'
      }
    ]
  }),
  setup() {
    const {
      uid,
      loading,
      signingIn,
      signInWithGoogle,
      sendSignInLinkToEmail,
      createUserWithEmailAndPassword,
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
      sendSignInLinkToEmail,
      createUserWithEmailAndPassword,
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

    this.community = ls('city')

    if (this.uid) {
      this.redirect()
    }
  },
  methods: {
    redirect() {
      let target = ls('target')
      ls.remove('target')

      if (!target) {
        target = '/settings'
      }

      this.$router.push(target)
    },
    async reload() {
      await this.signOut()
    },
    submit(e) {
      e.preventDefault()

      if (!this.email.trim()) {
        return
      }

      if (this.tab === 'login') {
        if (this.password) {
          this.signUserIn(this.email, this.password)
        } else {
          this.sendSignInLinkToEmail(this.email)
          this.emailSent = true
        }
      } else {
        this.createUserWithEmailAndPassword(
          this.email,
          this.password,
          this.username,
          this.community
        )
      }
    }
  }
}
</script>
