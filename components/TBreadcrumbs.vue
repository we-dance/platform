<template>
  <nav class="flex p-4" aria-label="Breadcrumb">
    <ol role="list" class="flex flex-wrap items-center space-x-4">
      <li>
        <div>
          <a href="#" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </a>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name">
        <div class="flex items-center">
          <ChevronRightIcon
            class="h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <a
            :href="page.href"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            :aria-current="page.current ? 'page' : undefined"
            >{{ page.name }}</a
          >
        </div>
      </li>
    </ol>
  </nav>
</template>

<script>
import { HomeIcon, ChevronRightIcon } from '@vue-hero-icons/outline'

export default {
  components: {
    HomeIcon,
    ChevronRightIcon,
  },
  setup() {
    const pages = [
      { name: 'Explore', href: '#', current: false },
      { name: 'Munich', href: '#', current: false },
      { name: 'Megano Tanzschule', href: '#', current: false },
      { name: 'Party', href: '#', current: true },
    ]

    return {
      pages,
    }
  },
}
</script>
