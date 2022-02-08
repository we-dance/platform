<template>
  <div class="flex min-h-screen items-center justify-center bg-dark">
    <div
      class="absolute top-0 left-0 right-0 m-4 flex items-center justify-between"
    >
      <div class="flex items-center">
        <TIcon class="mt-2 mr-2 h-6 w-6" name="icon" />
        <TIcon class="h-4 w-32 text-white" name="logo-text" />
      </div>
      <div>
        <TButton allow-guests to="/signout">{{ $t('auth.signout') }}</TButton>
      </div>
    </div>
    <main class="mt-20 max-w-sm rounded bg-white p-4">
      <nuxt />
    </main>
  </div>
</template>

<script>
export default {
  name: 'PopupLayout',
}
</script>
