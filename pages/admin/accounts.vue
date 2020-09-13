<template>
  <main>
    <TTitle>Accounts</TTitle>
    <TGridAccounts v-model="accounts" editable />
  </main>
</template>

<script>
export default {
  data: () => ({
    accounts: {}
  })
}
</script>
