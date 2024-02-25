<template>
  <div>
    <div class="rounded-md overflow-hidden shadow">
      <div class="bg-orange-100 flex justify-center">
        <TIcon name="find-partner" />
      </div>
      <div class="p-4 flex flex-col items-center">
        <div class="text-sm text-center pb-4">
          Explore dancers in your city and connect with them to find your next
          dance partner.
        </div>
        <TButton
          :to="localePath('/find-partner/start')"
          type="primary"
          label="Find Dance Partner"
        />
      </div>
    </div>
  </div>
</template>
