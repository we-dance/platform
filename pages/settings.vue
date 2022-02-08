<template>
  <main>
    <TLoader v-if="loading || !profile || !account" />
    <div v-else>
      <THeader :title="$t('settings.title')" />

      <div class="p-4 space-y-4">
        <div class="rounded bg-white shadow border p-4 bg-white">
          <div class="flex items-center">
            <div>
              <NuxtLink
                v-if="currentTab !== 'account'"
                to="/settings?tab=account"
              >
                <TIcon class="h-8 w-8" name="arrow_right" />
              </NuxtLink>
              <NuxtLink v-else to="/settings">
                <TIcon class="h-8 w-8" name="arrow_drop_down" />
              </NuxtLink>
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
              class="space-y-4"
              @save="saveAccount"
            />
            <TButton to="/settings?tab=password" class="mt-4">{{
              $t('settings.account.changepassword')
            }}</TButton>
            <div class="bg-red-200 mt-4 -mb-4 -mx-4 p-4">
              <TButton
                type="danger"
                @click="deleteAccountPopupVisible = true"
                >{{ $t('settings.account.delete') }}</TButton
              >
              <TPopup
                v-if="deleteAccountPopupVisible"
                :title="$t('settings.account.popup.delete.title')"
                @close="deleteAccountPopupVisible = false"
              >
                <div class="py-4 space-y-4">
                  <TField
                    v-model="deleteReason"
                    label-position="vertical"
                    component="TInputTextarea"
                    :label="$t('settings.account.popup.delete.deleteReason')"
                  />
                  <TField
                    v-model="usernameConfirmation"
                    label-position="vertical"
                    :placeholder="profile.username"
                    :label="
                      $t('settings.account.popup.delete.usernameConfirmation')
                    "
                  />
                  <div class="flex justify-end">
                    <TButton type="danger" @click="deleteAccountAction()">{{
                      $t('settings.account.delete')
                    }}</TButton>
                  </div>
                </div>
              </TPopup>
            </div>
          </div>
          <div v-if="currentTab === 'password'" class="border-t mt-4 pt-4">
            <TField v-model="password" v-bind="passwordField" />
            <div class="flex justify-end mt-4">
              <TButton @click="changePassword">{{ $t('form.save') }}</TButton>
            </div>
          </div>
          <TPopup
            v-if="passwordError"
            :title="$t('settings.passwordError')"
            @close="passwordError = ''"
          >
            <div class="py-4 max-w-md">{{ passwordError.message }}</div>
            <div class="flex justify-end mb-4">
              <TButton
                v-if="passwordError.code === 'auth/requires-recent-login'"
                type="primary"
                to="/signout?target=/signin"
                class="float-right mt-4"
                >{{ $t('auth.signout') }}</TButton
              >
            </div>
          </TPopup>
        </div>
        <div class="rounded bg-white shadow border p-4 bg-white">
          <div class="flex items-center">
            <div>
              <NuxtLink
                v-if="currentTab !== 'profile'"
                to="/settings?tab=profile"
              >
                <TIcon class="h-8 w-8" name="arrow_right" />
              </NuxtLink>
              <NuxtLink v-else to="/settings">
                <TIcon class="h-8 w-8" name="arrow_drop_down" />
              </NuxtLink>
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
            class="border-t mt-4 pt-4 space-y-4"
            @save="saveProfile"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useProfiles } from '~/use/profiles'
import { useAccounts } from '~/use/accounts'
import { useRouter } from '~/use/router'
import { db, track } from '~/plugins/firebase'

export default {
  name: 'PageSettings',
  middleware: ['auth'],
  data: () => ({
    deleteAccountPopupVisible: false,
    usernameConfirmation: '',
    deleteReason: '',
  }),
  setup() {
    const {
      uid,
      profile,
      account,
      signOut,
      updateAccount,
      updateProfile,
      loading,
      updatePassword,
      updateEmail,
      deleteAccount,
    } = useAuth()

    const { profileFields, contactFields } = useProfiles()
    const { accountFields: allAccountFields } = useAccounts()
    const password = ref('')
    const passwordError = ref(false)
    const { router } = useRouter()

    const accountFields = allAccountFields.filter((f) => f.name !== 'password')
    const passwordField = allAccountFields.find((f) => f.name === 'password')

    const changePassword = async () => {
      try {
        await updatePassword(password.value)
        router.push({
          query: {
            tab: 'account',
          },
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
      updateEmail,
      profileFields,
      contactFields,
      password,
      changePassword,
      passwordField,
      deleteAccount,
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
            tab,
          },
        })
      },
    },
  },
  methods: {
    async deleteAccountAction() {
      if (this.usernameConfirmation !== this.profile.username) {
        this.$toast.error('Enter username to confirm account deletion')
        return
      }

      try {
        track('delete_account')

        await db.collection('suspended').add({
          reason: this.deleteReason,
          username: this.profile.username,
          email: this.account.email,
          deletedAt: Date.now(),
          uid: this.uid,
          account: this.account,
          profile: this.profile,
        })

        await this.deleteAccount()
        this.$toast.success('Your account has been deleted')
        this.$router.push('/')
      } catch (e) {
        this.passwordError = e
      }
    },
    goToProfile() {
      this.$router.push(`/${this.profile.username}`)
    },
    async saveProfile(data) {
      if (data.bio?.length > 140) {
        this.$toast.error('Teaser can be maximum 140 symbols.')
        return
      }

      track('save_profile')

      await this.updateProfile(data)

      this.goToProfile()
    },
    async saveAccount(data) {
      try {
        await this.updateEmail(data.email)

        track('save_account')

        await this.updateAccount(data)
        this.$router.push('/settings')
      } catch (e) {
        this.passwordError = e
      }
    },
  },
  head() {
    return {
      title: 'WeDance Settings',
    }
  },
}
</script>
