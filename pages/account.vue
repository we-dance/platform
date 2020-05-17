<template>
  <TLoader v-if="loading" />
  <main v-else class="p-4 bg-white">
    <portal to="title">
      <div class="text-lg">Your Account</div>
    </portal>

    <TForm
      v-model="account"
      :fields="fields"
      :submit-label="`${confirmedAccount ? 'Save' : 'Confirm'}`"
      @save="save"
    />

    <div class="border-t p-4 bg-red-100 -mx-8 mt-4 -mb-8">
      <TButton to="/signout">
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
        name: 'name',
        label: 'Name',
        required: true,
        placeholder: '(Required)'
      },
      {
        name: 'city',
        label: 'City',
        required: true,
        placeholder: '(Required)'
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
