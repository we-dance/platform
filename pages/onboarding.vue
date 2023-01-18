<template>
  <TLoader v-if="loading" />
  <form v-else class="max-w-md" @submit.prevent="next">
    <div v-if="step == 'name'">
      <TField
        ref="name"
        v-model="profile.name"
        label="Hi! What's your name?"
        label-position="vertical"
      />
    </div>

    <div v-if="step == 'username'">
      <TField
        ref="username"
        v-model="profile.username"
        label="Pick a username"
        component="TInputUsername"
        label-position="vertical"
        description="There might be lot of people with the same name, so username will help others to differentiate who is who. Also link to your profile will be wedance.vip/username"
      />
    </div>

    <div v-if="step == 'gender'">
      <TField
        ref="gender"
        v-model="profile.gender"
        label="How do you identify?"
        label-position="vertical"
        component="TInputButtons"
        :options="genderOptions"
      />
    </div>

    <div v-if="step == 'place'">
      <TField
        ref="place"
        v-model="profile.place"
        label="Dance community of which city would you like to join?"
        label-position="vertical"
        component="TInputPlace"
      />
    </div>

    <div v-if="step == 'photo'">
      <TField
        v-model="profile.photo"
        label="Last step! Upload your photo"
        label-position="vertical"
        component="TInputPhoto"
      />

      <TButton
        v-if="!profile.photo"
        class="mt-4"
        type="secondary"
        @click="skipPhoto"
        >Skip for now</TButton
      >
    </div>

    <div v-if="step != 'photo' || profile.photo" class="flex justify-end mt-4">
      <TButton type="primary" @click="next">Next</TButton>
    </div>
  </form>
</template>

<script>
import ls from 'local-storage'
import { useAuth } from '~/use/auth'

export default {
  middleware: ['auth'],
  name: 'Onboarding',
  layout: 'popup',

  setup() {
    const {
      profile: loadedProfile,
      loading: loadingAuth,
      updateProfile,
      updateAccount,
      uid,
    } = useAuth()

    return {
      updateProfile,
      updateAccount,
      loadingAuth,
      loadedProfile,
      uid,
    }
  },

  data: () => ({
    redirecting: false,
    step: 'name',
    profile: {},
    skip: {},
    nextSteps: {
      name: 'username',
      username: 'gender',
      gender: 'place',
      place: 'photo',
      photo: 'finish',
    },
    genderOptions: [
      {
        label: 'I am a woman',
        value: 'Female',
      },
      {
        label: 'I am a man',
        value: 'Male',
      },
    ],
  }),

  computed: {
    loading() {
      return this.step === 'finish' || (this.loadingAuth && !this.loadedProfile)
    },
  },

  watch: {
    loadedProfile: 'load',
  },

  mounted() {
    const city = ls('city')

    this.profile.place = city
  },
  methods: {
    skipPhoto() {
      this.skip.photo = true
      this.next()
    },
    async load() {
      if (this.loadedProfile && !this.profile.name) {
        this.profile = this.loadedProfile
      }

      if (this.profile?.username && this.profile?.place && this.profile?.name) {
        await this.finish()
      }
    },
    next() {
      if (this.profile[this.step] || this.skip[this.step]) {
        this.updateProfile({
          step: this.step,
          ...this.profile,
        })

        this.step = this.nextSteps[this.step]

        if (this.step === 'finish') {
          this.finish()
        }
      }
    },
    async finish() {
      if (this.redirecting) {
        return
      }

      this.redirecting = true

      await this.updateAccount({
        confirmed: true,
      })

      let target = ls('target')
      ls.remove('target')

      if (!target) {
        target = `/settings`
      }

      this.$router.push(target)
    },
  },
}
</script>
