<template>
  <TList
    title="Shares"
    collection="profiles"
    :filter-default="{ permission: 'Yes' }"
    sort-by="-updatedAt"
    list-wrapper="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2"
  >
    <template v-slot:item="{ item }">
      <router-link :to="`/${item.username}`" class="hover:opacity-75">
        <TSharePreviewPost
          :type="item.type"
          collection="profiles"
          :username="item.username"
          :description="getExcerpt(item.bio)"
          :color="item.partner === 'Yes' ? 'bg-green-400' : 'bg-red-400'"
          :photo="item.photo"
          :styles="item.styles"
          size="sm"
        />
      </router-link>
    </template>
  </TList>
</template>

<script>
import { getExcerpt } from '~/utils'

export default {
  name: 'PageAdminShareProfiles',
  setup() {
    return {
      getExcerpt
    }
  }
}
</script>
