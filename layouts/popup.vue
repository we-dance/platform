<template>
  <div class="bg-dark flex justify-center items-center min-h-screen">
    <main class="bg-white rounded p-8 max-w-sm mt-20">
      <div class="mb-4 flex justify-center">
        <router-link to="/">
          <TIcon name="logo-horizontal-dark" />
        </router-link>
      </div>
      <nuxt />
    </main>
  </div>
</template>

<script>
export default {
  name: 'PopupLayout',
}
</script>
