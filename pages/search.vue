<template>
  <div>
    <div class="bg-gray-200 p-2 pl-12 md:pl-2">
      <TInput
        v-model="query"
        auto-focus
        placeholder="Search profiles"
        class="rounded-full"
        @input="search"
      />
    </div>
    <NuxtLink
      v-for="item in response.hits"
      :key="item.id"
      :to="`/${item.username}`"
      class="border-b p-4 flex items-center hover:bg-blue-200"
    >
      <div class="w-12 flex-shrink-0">
        <TProfilePhoto2 size="sm" :src="item.photo" />
      </div>
      <div class="flex-grow">
        <div class="block leading-tight">{{ item.name }}</div>
        <div class="block text-xs leading-tight">
          {{ item.type }} • @{{ item.username }}
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
import { ref } from 'vue-demi'
import { useAlgolia } from '~/use/algolia'

export default {
  setup() {
    const query = ref('')
    const { search, response } = useAlgolia('profiles')

    return { query, search, response }
  },
  mounted() {
    this.search()
  },
}
</script>
