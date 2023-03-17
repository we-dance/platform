<template>
  <div class="px-3 font-sans tracking-tight" v-if="isVisible">
    <div class="h-14 flex justify-end items-center" @click="closePopUp">
      <TIcon name="close" size="3" class="mr-3"/>
    </div>

    <section class="bg-gray-200 p-4 rounded-lg">
      <div class="m-auto w-fit"><img src="img/gift.png"/></div>
      <h1 class="text-3xl text-center font-extrabold">Try Premium</h1>
      <p class="text-lg text-center py-3">Invite 5 friends to get a card from your profile and get premium for free for 1 month. Limited offer, 200 left!</p>
    </section>
    
    <section class="max-w-fit px-3 m-auto pb-2 mt-3">
      <h2 class="font-extrabold text-center text-2xl py-3">Why get Premium?</h2>
      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Get special offers from organisers</p>
      </div>
      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Exclusive discounts</p>
      </div>
      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Access to online classes</p>
      </div>
    </section>
    <section class="max-w-fit m-auto">
      <TButton to="/" type="primary" label="Get Premium" class="w-72"/>
    </section>

    <div class="w-fit m-auto my-4 flex flex-col gap-2">
      <a href="/" class="underline text-center text-sm font-bold py-2">Are you an Organizer?</a>
      <a href="/" class="underline text-center text-sm font-bold py-2">Are you an Artist?</a>
    </div>
  </div>
</template>

<script>
  export default {
    components() { TIcon },
    data() {
      return {
        isVisible: true
      }
    },
    methods: {
      closePopUp() {
        this.isVisible = false
      }
    }
  }
</script>