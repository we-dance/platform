<template>
  <div class="md:flex">
    <nav class="p-4 md:w-64">
      <router-link
        v-for="tab in tabs"
        :key="tab.key"
        :to="`?tab=${tab.key}`"
        class="block p-2 hover:bg-gray-300"
        :class="currentTab === tab.key ? 'bg-gray-400 font-bold' : ''"
      >
        {{ tab.label }}
      </router-link>
    </nav>
    <main class="flex-grow max-w-lg">
      <TLoader v-if="loading || !profile || !account" />
      <div v-else>
        <div v-if="currentTab === 'welcome'">
          <div class="font-bold text-xl mb-4 pb-4 border-b">Let's start!</div>
          <div class="my-4">
            Complete all 3 steps to get access to all the features of the
            platform.
          </div>

          <div>
            <div class="block mb-2">
              <TButton to="/settings?tab=profile">
                <span
                  v-if="!profile.username"
                  class="rounded-full w-6 h-6 bg-blue-500 text-white mr-1 inline-block"
                >
                  1
                </span>
                <TIcon
                  v-else
                  name="check_circle"
                  class="w-6 h-6 rounded-full bg-white text-green-500 mr-1 inline-block -mb-1"
                />
                Create your profile</TButton
              >
            </div>
            <div class="block mb-2">
              <TButton to="/settings?tab=preferences">
                <span
                  v-if="!profile.days"
                  class="rounded-full w-6 h-6 bg-blue-500 text-white mr-1 inline-block"
                >
                  2
                </span>
                <TIcon
                  v-else
                  name="check_circle"
                  class="w-6 h-6 rounded-full bg-white text-green-500 mr-1 inline-block -mb-1"
                />
                Add your interests</TButton
              >
            </div>
            <div class="block mb-2">
              <TButton @click="intro">
                <span
                  v-if="!profile.intro"
                  class="rounded-full w-6 h-6 bg-blue-500 text-white mr-1 inline-block"
                >
                  3
                </span>
                <TIcon
                  v-else
                  name="check_circle"
                  class="w-6 h-6 rounded-full bg-white text-green-500 mr-1 inline-block -mb-1"
                />
                Introduce yourself</TButton
              >
            </div>
          </div>
        </div>
        <div
          v-if="currentTab === 'preferences'"
          class="rounded bg-white mb-4 shadow border p-4 bg-white"
        >
          <div class="font-bold text-xl">Preferences</div>
          <div class="text-sm text-gray-700 mb-4 pb-2 border-b">
            Let us help you find and highlight the most relevant things for you.
          </div>

          <TForm
            v-model="profile"
            :fields="preferencesFields"
            submit-label="Save"
            @save="saveProfile"
          />
        </div>
        <div
          v-if="currentTab === 'account'"
          class="rounded bg-white mb-4 shadow border p-4 bg-white"
        >
          <div class="font-bold text-xl">Account</div>
          <div class="text-sm text-gray-700 mb-4 pb-2 border-b">
            This information will be used for notifications and purchases. It
            will be shared with service providers or sellers only with your
            agreement.
          </div>

          <TForm
            v-model="account"
            :fields="accountFields"
            submit-label="Save"
            @save="saveAccount"
          />
        </div>
        <div
          v-if="currentTab === 'profile'"
          class="rounded bg-white mb-4 shadow border p-4 bg-white"
        >
          <div class="font-bold text-xl">Profile</div>
          <div class="text-sm text-gray-700 mb-4 pb-2 border-b">
            <div>
              What do you want other dancers to know about you? That's a place
              to share your passion to dance. Present yourself, don't be shy!
            </div>
            <div v-if="profileUrl">
              Your profile is available at
              <a :href="profileUrl">{{ profileUrl }}</a>
            </div>
          </div>

          <TForm
            v-model="profile"
            :fields="profileFields"
            submit-label="Save"
            @save="saveProfile"
          />
        </div>
        <div
          v-if="currentTab === 'contacts'"
          class="rounded bg-white mb-4 shadow border p-4 bg-white"
        >
          <div class="font-bold text-xl">Contacts</div>
          <div class="text-sm text-gray-700 mb-4 pb-2 border-b">
            This information will be publicly available. Share your contacts
            only if you want to be contacted by members. It's also nice place to
            share your social media to get some attention.
          </div>

          <TForm
            v-model="profile"
            :fields="contactFields"
            submit-label="Save"
            @save="saveProfile"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'

export default {
  middleware: ['auth'],
  layout: 'minimal',
  setup() {
    const {
      uid,
      profile,
      account,
      signOut,
      updateAccount,
      updateProfile,
      isAccountConfirmed,
      loading
    } = useAuth()

    const { preferencesFields, profileFields, contactFields } = useProfiles()

    return {
      loading,
      uid,
      account,
      profile,
      signOut,
      updateAccount,
      updateProfile,
      isAccountConfirmed,
      preferencesFields,
      profileFields,
      contactFields
    }
  },
  data: () => ({
    tabs: [
      {
        key: 'welcome',
        label: 'Welcome'
      },
      {
        key: 'profile',
        label: 'Profile'
      },
      {
        key: 'contacts',
        label: 'Contacts'
      },
      {
        key: 'preferences',
        label: 'Preferences'
      },
      {
        key: 'account',
        label: 'Account'
      }
    ],

    accountFields: [
      {
        name: 'name',
        label: 'Full Name',
        required: true,
        placeholder: '(Required)'
      },
      {
        name: 'email',
        label: 'Email',
        disabled: true
      },
      {
        name: 'phone',
        label: 'Phone'
      }
    ]
  }),
  computed: {
    profileUrl() {
      const username = this.profile.username

      if (!username) {
        return ''
      }

      const url = process.env.app.url

      return `${url}/u/${username}`
    },
    currentTab() {
      return this.$route.query.tab || 'welcome'
    }
  },
  watch: {
    account: 'load'
  },
  mounted() {
    this.load()
  },
  methods: {
    async intro() {
      await this.saveProfile({
        intro: true
      })

      this.$router.push('/posts/74zve0dQqtdwaSXq7RDf')
    },
    load() {
      this.profileFields.find(
        (f) => f.name === 'name'
      ).default = this.account?.name
    },
    async saveProfile(data) {
      await this.updateProfile(data)

      if (
        this.profile.username &&
        this.profile.days &&
        !this.account.confirmed
      ) {
        await this.finish()
      } else {
        this.$router.push('/settings')
      }
    },
    async saveAccount(data) {
      await this.updateAccount(data)
      this.$router.push('/settings')
    },
    async finish() {
      console.log('finish')
      await this.updateAccount({
        confirmed: true
      })

      const target = ls('target')
      ls.remove('target')

      if (!target) {
        return
      }

      this.$router.push(target)
    }
  }
}
</script>
