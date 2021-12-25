<template>
  <button
    type="button"
    value=""
    class="w-full mr-4 flex text-left justify-between items-center px-3 py-2 text-black transition duration-100 ease-in-out rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
    @click="toggleDropdown"
  >
    <span class="block truncate text-gray-400">{{ label }}</span
    ><svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      class="fill-current flex-shrink-0 ml-1 h-4 w-4 text-gray-600"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      ></path>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'TSelectButton',
  props: {
    toggleDropdown: {
      type: Function,
      default: () => ({}),
    },
    label: {
      type: String,
      default: '',
    },
  },
}
</script>
