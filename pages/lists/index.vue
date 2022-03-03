<template>
  <TList
    title="Lists"
    collection="lists"
    :filter-default="{ createdBy: uid }"
    class="p-1"
  >
    <template v-slot:item="{ item }">
      <NuxtLink
        :to="`/lists/${item.id}`"
        class="block rounded border bg-white px-4 py-2 shadow hover:bg-gray-100"
      >
        <h3 class="text-sm font-bold">{{ item.label }}</h3>
        <div class="text-xs text-gray-700">
          {{ Object.keys(item.posts).length }} items
        </div>
      </NuxtLink>
    </template>
  </TList>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  name: 'PageListIndex',
  setup() {
    const { uid } = useAuth()

    return { uid }
  },
}
</script>
