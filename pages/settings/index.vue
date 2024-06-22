<template>
  <main>
    <TLoader v-if="loading || !profile || !account" />
    <div v-else>
      <THeader :title="$t('settings.title')" />

      <div class="p-4 space-y-4">
        <div class="rounded bg-white shadow border p-4">
          <div class="flex items-center">
            <div>
              <NuxtLink
                v-if="currentTab !== 'account'"
                :to="localePath('/settings?tab=account')"
              >
                <TIcon class="h-8 w-8" name="arrow_right" />
              </NuxtLink>
              <NuxtLink v-else :to="localePath('/settings')">
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
            <TButton :to="localePath('/nopassword')" class="mt-4">{{
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
        </div>
        <div class="rounded bg-white shadow border p-4">
          <div class="flex items-center">
            <div>
              <NuxtLink
                v-if="currentTab !== 'profile'"
                :to="localePath('/settings?tab=profile')"
              >
                <TIcon class="h-8 w-8" name="arrow_right" />
              </NuxtLink>
              <NuxtLink v-else :to="localePath('/settings')">
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
        <div class="rounded bg-white shadow border p-4">
          <div class="flex items-center">
            <div>
              <NuxtLink :to="localePath('/settings/calendars')">
                <TIcon class="h-8 w-8" name="arrow_right" />
              </NuxtLink>
            </div>
            <div class="ml-2">
              <div class="font-bold text-xl">
                <NuxtLink :to="localePath('/settings/calendars')">
                  {{ $t('settings.calendars.title') }}
                </NuxtLink>
              </div>
              <div class="text-sm text-gray-700">
                <div>
                  {{ $t('settings.calendars.description') }}
                </div>
              </div>
            </div>
          </div>
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
      updateEmail,
      deleteAccount,
    } = useAuth()

    const { profileFields, contactFields } = useProfiles()
    const { accountFields: allAccountFields } = useAccounts()
    const password = ref('')
    const passwordError = ref(false)

    const accountFields = allAccountFields.filter((f) => f.name !== 'password')
    const passwordField = allAccountFields.find((f) => f.name === 'password')

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
        this.$track('delete_account')

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
      this.$router.push(this.localePath(`/${this.profile.username}`))
    },
    async saveProfile(data) {
      this.$track('save_profile')

      await this.updateProfile(data)

      this.goToProfile()
    },
    async saveAccount(data) {
      try {
        await this.updateEmail(data.email)

        this.$track('save_account')

        await this.updateAccount(data)
        this.$router.push(this.localePath('/settings'))
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
