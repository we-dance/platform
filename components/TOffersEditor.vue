<template>
  <div class="max-w-md mx-auto p-4">
    <TForm :fields="offerFields" />

    <LandingFeature
      title="Salsa From Zero"
      description="Experience the energy and fun of Salsa Cubana. Our free, donation-based classes are perfect for expats, with English as the primary language. Led by Alex, who has 7 years of dancing experience and training in Cuba, our focus is on enjoying the dance and learning together."
      button="Join Next Class"
      url="?view=events#tabs"
    />
  </div>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const offerFields = [
      {
        name: 'offers',
        component: 'TInputArray',
        hideLabel: true,
        children: {
          component: 'TInputOffer',
        },
      },
    ]
    return { offerFields }
  },
}
</script>
