<template>
  <div class="flex justify-center items-center">
    <div class="p-4 flex flex-col items-center gap-4">
      <TIcon name="success" />

      <h1 class="text-3xl font-extrabold text-center">
        Invitations Sent Successfully!
      </h1>
      <div class="text-center text-xl text-gray-700 mb-4">
        Your invitations have been sent to the selected profiles. You will be
        notified if they accept or decline your invitation. Remember,
        invitations expire in 24 hours, so keep an eye on your inbox
      </div>
      <div class="flex justify-center py-4">
        <TButton type="primary" to="/">Return Home</TButton>
      </div>
    </div>
  </div>
</template>
