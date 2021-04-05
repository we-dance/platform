<template>
  <TItemEdit
    title="Edit Offer"
    save-label="Save"
    add-label="Add"
    collection="offers"
    singular="offer"
    index-url="/offers"
    :fields="offerFields"
    :defaults="{ city: currentCity }"
    :edit-creator="isAdmin()"
  />
</template>

<script>
import { offerFields } from '~/use/offers'
import { useCities } from '~/use/cities'
import { useAuth } from '~/use/auth'

export default {
  name: 'OfferEdit',
  layout: 'dark',
  middleware: ['auth'],
  setup() {
    const { currentCity } = useCities()
    const { isAdmin } = useAuth()

    return {
      offerFields,
      currentCity,
      isAdmin
    }
  }
}
</script>
