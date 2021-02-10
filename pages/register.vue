<template>
  <TAuthError v-if="error" :error="error" />
  <TLoader v-else-if="loading || signingIn" />
  <div v-else>
    <form class="space-y-4" @submit="submit">
      <TField
        id="username"
        v-model="username"
        label="Username"
        type="username"
        required
        label-position="top"
      />
      <TField
        id="email"
        v-model="email"
        type="email"
        label="Email"
        required
        label-position="top"
      />
      <TField
        id="password"
        v-model="password"
        type="password"
        label="Password"
        required
        label-position="top"
      />
      <TField
        v-model="community"
        label="I dance in"
        label-position="vertical"
        type="city"
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
          Register
        </TButton>
      </div>
      <div class="mt-4 text-xs">
        <div class="mt-4 border-t pt-4 flex space-x-2 text-xs">
          <router-link to="/signin" class="underline hover:no-underline"
            >Login</router-link
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
      signingIn,
      createUserWithEmailAndPassword,
      signOut,
      error
    } = useAuth()

    return {
      uid,
      loading,
      signingIn,
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
        target = '/'
      }

      this.$router.push(target)
    },
    submit(e) {
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

      this.createUserWithEmailAndPassword(
        this.email,
        this.password,
        this.username,
        this.community
      )
    }
  }
}
</script>
