<template>
  <div>
    <div v-if="deals.length > 0" class="bg-orange-50">
      <div class="p-4 pb-0">
        <span class="rounded bg-primary text-white text-xs px-1">
          Win Ticket
        </span>
      </div>
      <NuxtLink
        v-for="deal in deals"
        :key="deal.id"
        :to="localePath(`/events/${deal.id}`)"
        class="hover:opacity-75"
        @click.native="
          $track('win_ticket_click', { name: deal.name, id: deal.id })
        "
      >
        <TEventText3
          :item="deal"
          class="border-orange-100"
          @visible="
            $track('win_ticket_impression', { name: deal.name, id: deal.id })
          "
        />
      </NuxtLink>
    </div>
    <div class="text-right p-4">
      <TButton
        type="link"
        :to="localePath('/explore/global')"
        class="text-xs text-primary hover:no-underline"
        label="Discover Hot Deals"
      />
    </div>
  </div>
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
      .where('hasLottery', '==', 'Yes')
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
