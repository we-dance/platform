<template>
  <div class="bg-gray-100 py-4 flex justify-center">
    <div class="max-w-md p-4 space-y-1">
      <div class="flex justify-center"></div>
      <h3 class="text-2xl font-extrabold text-center">
        Follow Us
      </h3>
      <TContactsGrid
        class="mt-4"
        :profile="{
          youtube: 'https://www.youtube.com/channel/UC1pdWS3nCLrd8LnQyNNSNUw',
          instagram: 'https://instagram.com/WeDancePlatform',
          telegram: 'https://t.me/WeDancePlatform',
          twitter: 'https://twitter.com/WeDancePlatform',
          facebook: 'https://www.facebook.com/WeDance-109777921433083',
        }"
      />
    </div>
  </div>
</template>

<script>
export default {}
</script>
