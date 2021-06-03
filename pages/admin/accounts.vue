<template>
  <main>
    <TTitle>Accounts</TTitle>
    <TGridAccounts v-model="accounts" editable />
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
