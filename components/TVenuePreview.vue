<template>
  <a
    v-if="venue"
    :href="venue.url"
    target="_blank"
    class="block border-b py-2 px-4 hover:bg-gray-200"
  >
    <div class="flex items-center justify-start leading-tight">
      <TIcon name="place" class="mr-4 h-4 w-4" />
      <div>
        <h4 class="font-bold">
          {{ venue.name }}
        </h4>
        <div class="text-gray-700">
          {{ venue.formatted_address }}
        </div>
      </div>
    </div>
  </a>
  <div v-else></div>
</template>

<script>
export default {
  props: {
    venue: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
