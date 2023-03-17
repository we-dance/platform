<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-if="isVisible"
  >
    <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
        >
          <div
            class="h-14 flex justify-end items-center cursor-pointer"
            @click="closePopUp"
          >
            <TIcon name="close" size="3" class="mr-3" />
          </div>

          <section class="bg-gray-200 p-4 rounded-lg">
            <div class="m-auto w-fit"><img src="img/gift.png" /></div>
            <h1 class="text-3xl text-center font-extrabold">Try Premium</h1>
            <p class="text-lg text-center py-3">
              Invite 5 friends to get a card from your profile and get premium
              for free for 1 month. Limited offer, 200 left!
            </p>
          </section>

          <section class="max-w-fit px-3 m-auto pb-2 mt-3">
            <h2 class="font-extrabold text-center text-2xl py-3">
              Why get Premium?
            </h2>
            <div class="flex gap-2">
              <TIcon name="check-green" class="grid content-center" />
              <p class="text-lg my-1">Get special offers from organisers</p>
            </div>
            <div class="flex gap-2">
              <TIcon name="check-green" class="grid content-center" />
              <p class="text-lg my-1">Exclusive discounts</p>
            </div>
            <div class="flex gap-2">
              <TIcon name="check-green" class="grid content-center" />
              <p class="text-lg my-1">Access to online classes</p>
            </div>
          </section>
          <section class="max-w-fit m-auto">
            <TButton to="/" type="primary" label="Get Premium" class="w-72" />
          </section>

          <div class="w-fit m-auto my-4 flex flex-col gap-2">
            <a href="/" class="underline text-center text-sm font-bold py-2"
              >Are you an Organizer?</a
            >
            <a href="/" class="underline text-center text-sm font-bold py-2"
              >Are you an Artist?</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components() {
    TIcon
  },
  data() {
    return {
      isVisible: true,
    }
  },
  methods: {
    closePopUp() {
      this.isVisible = false
    },
  },
}
</script>
