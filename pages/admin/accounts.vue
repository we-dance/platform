<template>
  <main>
    <THeader title="Accounts" />
    <TGridAccounts v-model="accounts" editable class="p-4" />
  </main>
</template>

<script>
export default {
  name: 'PageAdminAccounts',
  middleware: ['auth'],
  data: () => ({
    accounts: {}
  })
}
</script>
