<template>
  <TList
    title="Offers"
    add="Add Offer"
    add-url="/offers/-/edit"
    collection="offers"
    :filter-default="{ city: currentCity }"
    :filter-fields="offerFilters"
  >
    <template v-slot:item="{ item }">
      <TOffer :offer="item" class="border rounded space-y-2" />
    </template>
  </TList>
</template>

<script>
import { offerFilters } from '~/use/offers'
import { useCities } from '~/use/cities'

export default {
  name: 'OfferIndex',
  setup() {
    const { currentCity } = useCities()

    return {
      offerFilters,
      currentCity
    }
  }
}
</script>
