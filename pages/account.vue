<template>
  <div class="md:flex">
    <nav class="p-4 md:w-64">
      <router-link
        v-for="tab in tabs"
        :key="tab.key"
        :to="`?tab=${tab.key}`"
        class="block p-2 hover:bg-gray-300"
        :class="$route.query.tab === tab.key ? 'bg-gray-300' : ''"
      >
        {{ tab.label }}
      </router-link>
    </nav>
    <main class="p-4 flex-grow max-w-lg">
      <TLoader v-if="loading" />
      <div v-else class="rounded bg-white mb-4 shadow border p-4 bg-white">
        <div class="font-bold text-xl mb-4 pb-4 border-b">Your Account</div>

        <TForm
          v-model="account"
          :fields="fields"
          :submit-label="`${confirmedAccount ? 'Save' : 'Confirm'}`"
          @save="save"
        />

        <div class="border-t mt-4 pt-4">
          <TButton color="red-500" to="/signout">
            Logout
          </TButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'
import TForm from '~/components/TForm'
import TLoader from '~/components/TLoader'
import TButton from '~/components/TButton'

export default {
  middleware: ['auth'],
  layout: 'minimal',
  components: {
    TButton,
    TForm,
    TLoader
  },
  setup() {
    const {
      uid,
      account,
      signOut,
      updateAccount,
      confirmedAccount,
      loading
    } = useAuth()

    return {
      loading,
      uid,
      account,
      signOut,
      updateAccount,
      confirmedAccount
    }
  },
  data: () => ({
    tabs: [
      {
        key: 'settings',
        label: 'Settings'
      }
    ],
    fields: [
      {
        name: 'email',
        disabled: true
      },
      {
        name: 'username',
        label: 'Username',
        required: true,
        placeholder: '(Required)'
      },
      {
        name: 'name',
        label: 'Name',
        required: true,
        placeholder: '(Required)'
      },
      {
        name: 'location',
        label: 'Location',
        required: true,
        placeholder: '(Required)'
      },
      {
        name: 'summary',
        label: 'Summary',
        type: 'textarea',
        placeholder: 'A short bio'
      },
      {
        name: 'skills',
        label: 'Dance Skills',
        type: 'textarea',
        placeholder: 'What dances are you most experienced with?'
      },
      {
        name: 'learning',
        label: 'I am getting into',
        type: 'textarea',
        placeholder: 'What are you learning right now?'
      }
    ]
  }),
  methods: {
    async save(data) {
      const changes = {
        ...data,
        confirmed: true
      }

      await this.updateAccount(changes)

      let target = ls('target')
      ls.remove('target')

      if (!target) {
        target = '/'
      }

      this.$router.push(target)
    }
  }
}
</script>
