<template>
  <div v-if="deals.length > 0" class="bg-orange-50">
    <div class="p-4 pb-0">
      <span class="rounded bg-primary text-white text-xs px-1">
        Hot Deals
      </span>
    </div>
    <NuxtLink
      v-for="deal in deals"
      :key="deal.id"
      :to="localePath(`/events/${deal.id}`)"
      class="hover:opacity-75"
    >
      <TEventText3 :item="deal" class="border-orange-100" />
    </NuxtLink>
  </div>
  <div v-else></div>
</template>

<script>
import { db } from '~/plugins/firebase'
import { sortBy } from '~/utils'

export default {
  data: () => ({
    deals: [],
  }),
  mounted() {
    db.collection('posts')
      .where('hotDeal', '==', 'Yes')
      .get()
      .then((querySnapshot) => {
        const deals = []

        querySnapshot.forEach((doc) => {
          deals.push({ id: doc.id, ...doc.data() })
        })

        this.deals = deals.sort(sortBy('startDate'))
      })
  },
}
</script>
