<template>
  <div class="bg-dark pb-16 md:pb-0 text-white text-sm">
    <div class="p-4 py-8 container mx-auto">
      <slot />

      <div class="grid grid-flow-cols grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col">
          <p>
            © WeDance 2020 – All rights reserved.
          </p>
          <p class="flex space-x-2">
            <router-link class="underline hover:no-underline" to="/about"
              >About</router-link
            >
            <router-link class="underline hover:no-underline" to="/support"
              >Support</router-link
            >
            <router-link class="underline hover:no-underline" to="/privacy"
              >Privacy</router-link
            >
            <router-link class="underline hover:no-underline" to="/terms"
              >Terms</router-link
            >
            <router-link class="underline hover:no-underline" to="/coc"
              >Code of Conduct</router-link
            >
            <router-link class="underline hover:no-underline" to="/faq"
              >FAQ</router-link
            >
          </p>
        </div>
        <div class="grid grid-flow-col grid-cols-4 grid-rows-1 gap-4">
          <a
            target="_blank"
            class="flex justify-center hover:opacity-50"
            href="https://instagram.com/WeDanceVIP"
            rel="noopener noreferrer"
          >
            <TIcon name="instagram" class="h-10 w-10" />
          </a>
          <a
            target="_blank"
            class="flex justify-center hover:opacity-50"
            href="https://t.me/wedancevip"
            rel="noopener noreferrer"
          >
            <TIcon name="telegram" class="h-10 w-10" />
          </a>
          <a
            target="_blank"
            class="flex justify-center hover:opacity-50"
            href="https://www.youtube.com/channel/UC1pdWS3nCLrd8LnQyNNSNUw?sub_confirmation=1"
            rel="noopener noreferrer"
          >
            <TIcon name="youtube" class="h-10 w-10" />
          </a>
          <a
            target="_blank"
            class="flex justify-center hover:opacity-50"
            href="https://twitter.com/WeDanceVIP"
            rel="noopener noreferrer"
          >
            <TIcon name="twitter" class="h-10 w-10" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
