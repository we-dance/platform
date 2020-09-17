<template>
  <form class="max-w-md" @submit.prevent="next">
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
        trim="[^a-z0-9]+"
        label-position="vertical"
        description="There might be lot of people with the same name, so username will help others to differentiate who is who. Also link to your profile will be wedance.vip/u/username"
      />
    </div>

    <div v-if="step == 'gender'">
      <TField
        ref="gender"
        v-model="profile.gender"
        label="How do you identify?"
        label-position="vertical"
        type="select"
        :options="genderOptions"
      />
    </div>

    <div v-if="step == 'styles'">
      <TField
        v-model="profile.styles"
        label="Tell us what you're interested in"
        label-position="vertical"
        placeholder="Salsa, Bachata, Kizomba, etc."
        type="styles"
      />
    </div>

    <div v-if="step == 'photo'">
      <TField
        v-model="profile.photo"
        label="Last step! Upload your photo"
        label-position="vertical"
        type="photo"
      />
    </div>

    <div v-if="step !== 'finish'" class="flex justify-end mt-4">
      <TButton type="primary" @click="next">Next</TButton>
    </div>
  </form>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'

export default {
  name: 'Onboarding',
  layout: 'popup',

  setup() {
    const { updateProfile, updateAccount } = useAuth()

    return {
      updateProfile,
      updateAccount
    }
  },

  data: () => ({
    step: 'name',
    profile: {},
    nextSteps: {
      name: 'username',
      username: 'gender',
      gender: 'styles',
      styles: 'photo',
      photo: 'finish'
    },
    genderOptions: [
      {
        label: 'I am a woman',
        value: 'Female'
      },
      {
        label: 'I am a man',
        value: 'Male'
      }
    ]
  }),
  mounted() {
    const city = ls('city')

    this.profile.community = city
  },
  methods: {
    next() {
      if (this.profile[this.step]) {
        this.updateProfile({
          step: this.step,
          ...this.profile
        })

        this.step = this.nextSteps[this.step]
        if (this.step === 'finish') {
          this.finish()
        }
      }
    },
    async finish() {
      await this.updateAccount({
        confirmed: true
      })

      let target = ls('target')
      ls.remove('target')

      if (!target) {
        target = `/u/${this.profile.username}`
      }

      this.$router.push(target)
    }
  }
}
</script>
