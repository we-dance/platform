<template>
  <div class="max-w-sm px-3 font-sans tracking-tight">
    <!-- <div class="h-14 flex justify-end items-center" @click="closePopUp">
      <TIcon name="close" size="3" class="mr-3"/>
    </div> -->

    <section class="bg-gray-200 p-4 rounded-lg mb-3">
      <div class="m-auto w-fit"><img src="img/gift.png"/></div>
      <h1 class="text-3xl text-center font-extrabold">Try Premium</h1>
      <p class="text-lg text-center py-3">Invite 5 friends to get a card from your profile and get premium for free for 1 month. Limited offer, 200 left!</p>
    </section>
    
    <TBenefits 
      title="Why get Premium?"
      icon="check-green"
      :benefits="[
        'Get special offers from organisers', 
        'Exclusive discounts', 
        'Access to online classes'
      ]"
      class="max-w-fit"
    />

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
  import TIcon from "/components/TIcon.vue"
  import TBenefits from "/components/TBenefits.vue"

  export default {
    components: { TIcon, TBenefits },
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