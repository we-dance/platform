<template>
  <main class="mt-8">
    <TLoader v-if="loading || !profile || !account" />
    <div v-else>
      <TPopup v-if="isBoosting" title="Bonus" @click="skipBoosting()">
        <div class="max-w-md">
          <div v-if="generating" class="p-4">
            Generating image... Please wait...
          </div>
          <div v-else>
            <div class="p-4">
              Would you like your profile to be published in our social media?
              <div class="mt-4 flex flex-col items-center space-y-2">
                <TButton
                  icon="instagram"
                  icon-size="6"
                  :href="`https://instagram.com/WeDance${profile.community}`"
                  :label="`WeDance${profile.community}`"
                />
                <TButton
                  icon="facebook"
                  icon-size="6"
                  :href="`https://fb.com/WeDance${profile.community}`"
                  :label="`WeDance${profile.community}`"
                />
                <TButton
                  icon="telegram"
                  icon-size="6"
                  :href="`https://t.me/WeDance${profile.community}`"
                  :label="`WeDance${profile.community}`"
                />
              </div>
            </div>
            <div class="flex justify-end mt-4 space-x-2">
              <TButton @click="skipBoosting()">No, thank you</TButton>
              <TButton type="primary" @click="generate()">Yes!</TButton>
            </div>
          </div>
        </div>
      </TPopup>
      <div>
        <div class="font-bold text-xl mb-4 pb-4 border-b">
          {{ $t('settings.title') }}
        </div>
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
            <div class="font-bold text-xl">
              {{ $t('settings.account.title') }}
            </div>
            <div class="text-sm text-gray-700">
              {{ $t('settings.account.description') }}
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'account'" class="border-t mt-4 pt-4">
          <TForm
            v-model="account"
            :fields="accountFields"
            :submit-label="$t('save')"
            @save="saveAccount"
          />
          <TButton to="/settings?tab=password" class="mt-4">{{
            $t('settings.account.changepassword')
          }}</TButton>
          <div class="bg-red-200 mt-4 -mb-4 -mx-4 p-4">
            <TButton type="danger" @click="deleteAccount()">{{
              $t('settings.account.delete')
            }}</TButton>
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
                >{{ $t('signout') }}</TButton
              >
            </div>
          </div>
          <div v-else>
            <TField v-model="password" type="password" label="New Password" />
            <div class="flex justify-end mt-4">
              <TButton @click="changePassword">{{ $t('save') }}</TButton>
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
            <div class="font-bold text-xl">
              {{ $t('settings.profile.title') }}
            </div>
            <div class="text-sm text-gray-700">
              <div>
                {{ $t('settings.profile.description') }}
              </div>
            </div>
          </div>
        </div>

        <TForm
          v-if="currentTab === 'profile'"
          v-model="profile"
          :fields="profileFields"
          :submit-label="$t('save')"
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
            <div class="font-bold text-xl">
              {{ $t('settings.contacts.title') }}
            </div>
            <div class="text-sm text-gray-700">
              {{ $t('settings.contacts.description') }}
            </div>
          </div>
        </div>

        <TForm
          v-if="currentTab === 'contacts'"
          v-model="profile"
          :fields="contactFields"
          :submit-label="$t('save')"
          class="border-t mt-4 pt-4"
          @save="saveProfile"
        />
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import { ref } from '@nuxtjs/composition-api'
import useAuth from '~/use/auth'
import useProfiles from '~/use/profiles'
import useAccounts from '~/use/accounts'
import useRouter from '~/use/router'

export default {
  middleware: ['auth'],
  data: () => ({
    canBoost: false,
    isBoosting: false,
    generating: false
  }),
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

      return `${url}/${username}`
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
    async skipBoosting() {
      await this.updateProfile({
        socialCoverAt: +new Date(),
        socialCoverPublish: 'No'
      })

      this.isBoosting = false

      this.goToProfile()
    },
    goToProfile() {
      this.$router.push(`/${this.profile.username}`)
    },
    async saveProfile(data) {
      await this.updateProfile(data)

      const canBoost =
        data.photo && data.styles && data.community && data.bio && data.type

      if (canBoost) {
        this.isBoosting = true
        return
      }

      this.goToProfile()
    },
    async saveAccount(data) {
      await this.updateAccount(data)
      this.$router.push('/settings')
    },

    async generate() {
      if (this.generating) {
        return
      }

      this.generating = true
      this.$nuxt.$loading.start()

      try {
        const result = await axios.get(
          `https://us-central1-wedance-4abe3.cloudfunctions.net/hooks/share/${this.profile.username}?timezone=Europe/Berlin`
        )

        if (!result.data.success) {
          throw new Error('Failed to make a screenshot')
        }

        const socialCover = result.data.url

        await this.updateProfile({
          socialCover,
          socialCoverBy: this.uid,
          socialCoverAt: +new Date(),
          socialCoverPublish: 'Yes'
        })
      } catch (e) {
        console.error(e)
      }

      this.generating = false
      this.isBoosting = false
      this.$nuxt.$loading.finish()

      this.goToProfile()
    }
  }
}
</script>
