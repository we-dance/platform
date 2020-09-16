<template>
  <div class="bg-dark flex justify-center items-center min-h-screen">
    <div
      class="absolute top-0 left-0 right-0 m-4 flex justify-between items-center"
    >
      <div class="flex items-center">
        <TIcon class="w-6 h-6 mt-2 mr-2" name="icon" />
        <TIcon class="h-4 w-32 text-white" name="logo-text" />
      </div>
      <div>
        <TButton to="/signout">Log out</TButton>
      </div>
    </div>
    <main class="bg-white rounded p-4 max-w-sm my-4">
      <nuxt />
    </main>
  </div>
</template>
