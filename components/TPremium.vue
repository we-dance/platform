<template>
  <div
    class="relative top-10 max-w-sm pt-3 pb-4 font-sans tracking-tight mx-auto"
  >
    <section class="bg-gray-200 p-4 rounded-lg mb-3">
      <div class="m-auto w-fit"><img src="img/gift.png" /></div>
      <h1 class="text-3xl text-center font-extrabold">Try Premium</h1>
      <p class="text-lg text-center py-3">
        Invite 5 friends to get a card from your profile and get premium for
        free for 1 month. Limited offer, 200 left!
      </p>
    </section>

    <TBenefits
      title="Why get Premium?"
      :benefits="[
        'Get special offers from organisers',
        'Exclusive discounts',
        'Access to online classes',
      ]"
      class="max-w-fit"
    />

    <section class="max-w-sm m-auto w-fit">
      <TButton
        href="mailto:support@wedance.vip"
        type="primary"
        label="Get Premium"
        class="w-64"
      />
    </section>

    <div class="w-fit m-auto my-4 flex flex-col gap-2">
      <a
        href="mailto:support@wedance.vip"
        class="underline text-center text-sm font-bold py-2"
        >Are you an Organizer?</a
      >
      <a
        href="mailto:support@wedance.vip"
        class="underline text-center text-sm font-bold py-2"
        >Are you an Artist?</a
      >
    </div>
  </div>
</template>
