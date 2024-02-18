<template>
  <div>
    <h2 class="px-4 text-center text-xl font-bold">Why WeDance?</h2>
    <div class="m-4 border rounded">
      <TPreview :content="$t('home.founder')" class="p-4" />
      <WProfile username="alexrazbakov" hide-role hide-buttons />
    </div>
  </div>
</template>

<script>
export default {}
</script>
