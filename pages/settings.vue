<template>
  <main class="mt-8">
    <TLoader v-if="loading || !profile || !account" />
    <div v-else>
      <div>
        <div class="font-bold text-xl mb-4 pb-4 border-b">Settings</div>
      </div>
      <div class="rounded bg-white mb-4 shadow border p-4 bg-white">
        <div class="flex items-center">
          <div>
            <router-link
              v-if="currentTab !== 'account'"
              to="/settings?tab=account"
            >
              <TIcon class="h-8 w-8" name="arrow_right" />
            </router-link>
            <router-link v-else to="/settings">
              <TIcon class="h-8 w-8" name="arrow_drop_down" />
            </router-link>
          </div>
          <div class="ml-2">
            <div class="font-bold text-xl">Account</div>
            <div class="text-sm text-gray-700">
              This information will be used for notifications and purchases. It
              will be shared with service providers or sellers only with your
              agreement.
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'account'" class="border-t mt-4 pt-4">
          <TForm
            v-model="account"
            :fields="accountFields"
            submit-label="Save"
            @save="saveAccount"
          />
          <TButton to="/settings?tab=password">Change Password</TButton>
          <div class="bg-red-200 mt-4 -mb-4 -mx-4 p-4">
            <TButton type="danger" @click="deleteAccount()"
              >Delete Account</TButton
            >
          </div>
        </div>
        <div v-if="currentTab === 'password'" class="border-t mt-4 pt-4">
          <div
            v-if="passwordError"
            class="text-red-500 rounded border border-red-500 p-2"
          >
            <p>{{ passwordError.message }}</p>
            <div class="flex justify-end">
              <TButton
                v-if="passwordError.code === 'auth/requires-recent-login'"
                type="primary"
                to="/signout"
                class="float-right mt-4"
                >Sign out</TButton
              >
            </div>
          </div>
          <div v-else>
            <TField v-model="password" type="password" label="New Password" />
            <div class="flex justify-end mt-4">
              <TButton @click="changePassword">Save</TButton>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded bg-white mb-4 shadow border p-4 bg-white">
        <div class="flex items-center">
          <div>
            <router-link
              v-if="currentTab !== 'profile'"
              to="/settings?tab=profile"
            >
              <TIcon class="h-8 w-8" name="arrow_right" />
            </router-link>
            <router-link v-else to="/settings">
              <TIcon class="h-8 w-8" name="arrow_drop_down" />
            </router-link>
          </div>
          <div class="ml-2">
            <div class="font-bold text-xl">Profile</div>
            <div class="text-sm text-gray-700">
              <div>
                What do you want other dancers to know about you? That's a place
                to share your passion to dance. Present yourself, don't be shy!
              </div>
            </div>
          </div>
        </div>

        <TForm
          v-if="currentTab === 'profile'"
          v-model="profile"
          :fields="profileFields"
          submit-label="Save"
          class="border-t mt-4 pt-4"
          @save="saveProfile"
        />
      </div>
      <div class="rounded bg-white mb-4 shadow border p-4 bg-white">
        <div class="flex items-center">
          <div>
            <router-link
              v-if="currentTab !== 'contacts'"
              to="/settings?tab=contacts"
            >
              <TIcon class="h-8 w-8" name="arrow_right" />
            </router-link>
            <router-link v-else to="/settings">
              <TIcon class="h-8 w-8" name="arrow_drop_down" />
            </router-link>
          </div>
          <div class="ml-2">
            <div class="font-bold text-xl">Contacts</div>
            <div class="text-sm text-gray-700">
              This information will be publicly available. Share your contacts
              only if you want to be contacted by members. It's also nice place
              to share your social media to get some attention.
            </div>
          </div>
        </div>

        <TForm
          v-if="currentTab === 'contacts'"
          v-model="profile"
          :fields="contactFields"
          submit-label="Save"
          class="border-t mt-4 pt-4"
          @save="saveProfile"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'
import useAccounts from '~/use/accounts'
import useRouter from '~/use/router'

export default {
  middleware: ['auth'],
  setup() {
    const {
      uid,
      profile,
      account,
      signOut,
      updateAccount,
      updateProfile,
      isAccountConfirmed,
      loading,
      updatePassword,
      deleteAccount
    } = useAuth()

    const { profileFields, contactFields } = useProfiles()
    const { accountFields } = useAccounts()
    const password = ref('')
    const passwordError = ref(false)
    const { router } = useRouter()

    const changePassword = async () => {
      try {
        await updatePassword(password.value)
        router.push({
          query: {
            tab: 'account'
          }
        })
      } catch (e) {
        passwordError.value = e
      }
    }

    return {
      passwordError,
      accountFields,
      loading,
      uid,
      account,
      profile,
      signOut,
      updateAccount,
      updateProfile,
      isAccountConfirmed,
      profileFields,
      contactFields,
      password,
      changePassword,
      deleteAccount
    }
  },
  computed: {
    profileUrl() {
      const username = this.profile.username

      if (!username) {
        return ''
      }

      const url = process.env.app.url

      return `${url}/u/${username}`
    },
    currentTab: {
      get() {
        return this.$route.query.tab || 'welcome'
      },
      set(tab) {
        this.$router.push({
          query: {
            tab
          }
        })
      }
    }
  },
  methods: {
    async saveProfile(data) {
      await this.updateProfile(data)
      this.$router.push('/settings')
    },
    async saveAccount(data) {
      await this.updateAccount(data)
      this.$router.push('/settings')
    }
  }
}
</script>
