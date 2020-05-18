<template>
  <TLoader v-if="loading" />
  <main v-else class="card-item border p-4 bg-white">
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
  </main>
</template>

<script>
import ls from 'local-storage'
import useAuth from '~/use/auth'
import TForm from '~/components/TForm'
import TLoader from '~/components/TLoader'
import TButton from '~/components/TButton'

export default {
  middleware: ['auth'],
  layout: (ctx) => (ctx.isMobile ? 'mobile' : 'desktop'),
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
