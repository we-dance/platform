<template>
  <main>
    <TTitle>Accounts</TTitle>
    <TGridAccounts v-model="accounts" />
  </main>
</template>

<script>
export default {
  data: () => ({
    accounts: {}
  })
}
</script>
