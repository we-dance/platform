<template>
  <div>
    <THeader title="Home" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <TAction title="Welcome to Munich!" action="Change city" url="/cities" />
      <TAction
        title="13 dancers match your profile"
        action="Ramble"
        url="/ramble"
      />
    </div>
  </div>
</template>
