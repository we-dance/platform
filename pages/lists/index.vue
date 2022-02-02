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
        class="rounded bg-white shadow border hover:bg-gray-100 px-4 py-2 block"
      >
        <h3 class="text-sm font-bold">{{ item.label }}</h3>
        <div class="text-gray-700 text-xs">
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
