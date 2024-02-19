<template>
  <div>
    <THeader show-logo class="md:hidden" />
    <div class="p-4">
      <h1 class="text-4xl font-extrabold text-center">
        Share your social media instantly
      </h1>
      <div class="flex justify-center pt-4">
        <img
          src="/img/nfc-screenshot.png"
          alt="WeDance Card Screenshot"
          class="h-[50vh]"
        />
      </div>
      <div class="text-center text-xl text-gray-700 mb-4">
        Turn a simple handshake into a lasting connection
      </div>

      <div class="flex justify-center py-4">
        <TButton
          type="primary"
          allow-guests
          href="https://wedance.gumroad.com/l/vip-card"
          target="_blank"
          >Order a card</TButton
        >
      </div>

      <h2 class="text-3xl font-extrabold text-center mt-4 mb-2">
        How it works
      </h2>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <DeviceMobileIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Tap the card</div>
          <div class="text-sm text-gray-700">
            Tap your card on your phone
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <LinkIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Link your profile</div>
          <div class="text-sm text-gray-700">
            Add your social media links
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <ThumbUpIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Start networking</div>
          <div class="text-sm text-gray-700">
            Share your profile by tapping your card on other person’s mobile and
            start networking faster.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DeviceMobileIcon,
  UserCircleIcon,
  LinkIcon,
  ThumbUpIcon,
} from '@vue-hero-icons/outline'

export default {
  components: {
    DeviceMobileIcon,
    UserCircleIcon,
    LinkIcon,
    ThumbUpIcon,
  },
}
</script>
