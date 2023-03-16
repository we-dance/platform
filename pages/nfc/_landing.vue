<template>
  <div class="font-sans bg-white leading-normal tracking-tight antialiased min-h-screen flex flex-col mx-auto max-w-xl border-r border-l">
    <header class="max-w-sm m-auto pt-8 pb-7 px-3">
      <img src="/img/brand.png" class="max-w-md m-auto"/>
      <h1 class="text-3xl text-center font-extrabold px-3 pt-4">Share your social media instantly</h1>
      <img src="/img/screenshot.png"/>
      <p class="max-w-sm m-auto text-center px-3 pb-6 text-lg font-medium">Turn a simple handshake into a lasting connection</p>
      
      <div class="max-w-max m-auto w-fit">
        <TButton to="/signin" type="primary" label="Link your Profile" allowGuests=true class="w-64"/> 
      </div>
    </header>
     
    <section class="px-3 m-auto pb-2">
      <h1 class="text-3xl text-center font-extrabold mb-4">Power of VIP Cards</h1>

      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Instant contact exchange</p>
      </div>

      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Environmentally friendly</p>
      </div>

      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Convenient and easy to use</p>
      </div>

      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Affordable</p>
      </div>

      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-1">Don&rsquo;t have space constraints</p>
      </div>

      <div class="flex gap-2">
        <TIcon name="check-green" class="grid content-center"/>
        <p class="text-lg my-2">More secure</p>
      </div>   
    </section>

    <section class="bg-gray-200 p-4 mb-6">
      <h2 class="text-3xl text-center font-extrabold p-3">How it works</h2>
      
      <div class="max-w-md m-auto">
        <div class="flex items-center">
          <TIcon name="tap-card"/>
          <div class="ml-2">
            <h3 class="text-slate-700 text-bold text-lg">Tap the card</h3>
            <p class="text-gray-500 text-sm">Tap your VIP Card on your own phone device</p>
          </div>
        </div>

        <img src="/img/divider.png" class="my-1"/>

        <div class="flex items-center">
          <TIcon name="phone"/>
          <div class="ml-2">
            <h3 class="text-slate-700 text-bold text-lg">Create and link your profile</h3>
            <p class="text-gray-500 text-sm">Sign-in and create your WeDance profile so it can be linked to your VIP Card</p>
          </div>
        </div>

        <img src="/img/divider.png" class="my-1"/>

        <div class="flex items-center">
          <TIcon name="card-network" />
          <div class="ml-2">
            <h3 class="text-slate-700 text-bold text-lg">Start networking </h3>
            <p class="text-gray-500 text-sm">Share your profile by tapping your VIP Card on other people&rsquo;s mobiles and start networking faster</p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-3 m-auto pb-2">
      <h2 class="text-3xl text-center font-extrabold mb-4">Premium Membership</h2>
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

    <section class="max-w-md m-auto h-64 p-3 mt-8">
      <h2 class="text-3xl text-center font-extrabold mb-2">Follow us</h2>
      <p class="font-normal text-lg text-center">We regularly post event announcements and introduce new members on our social media.</p>
      <div class="max-w-md m-auto pb-16">
        <div class="flex justify-center gap-3 pt-8">
          <a href="https://www.instagram.com/WeDancePlatform/" target="_blank">
            <TIcon name="instagram" size="10" class="rounded-full p-2" style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"/>
          </a>
          <a href="https://t.me/WeDanceTravel" target="_blank">
            <TIcon name="telegram" size="10" class="rounded-full p-2" style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"/>
          </a>
          <a href="https://twitter.com/WeDancePlatform" target="_blank">
            <TIcon name="twitter" size="10" class="rounded-full p-2" style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"/>
          </a>
          <a href="https://www.facebook.com/people/WeDance/100079633097491/" target="_blank">
            <TIcon name="facebook" size="10" class="rounded-full p-2" style="box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);"/>
          </a>
        </div>
      </div>
    </section>
    
  </div>
</template>

<script>
import TIcon from "/components/TIcon.vue";
import TButton from "/components/TButton.vue";

export default {
  layout: "empty",
  components: { TIcon, TButton }
};
</script>