<template>
  <div
    v-if="show"
    class=" 
      fixed
      flex      
      justify-center
      items-center
      inset-0 bg-indigo-800
    "
    style="z-index: 51 !important"
  >
    <div
      class="relative bg-white rounded-md shadow dark:bg-gray-700 border-2 max-w-xl"
    >
      <button
        type="button"
        class="text-gray-400 bg-transparent hover:text-gray-900"
        @click="close"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div class="rounded-2xl bg-white dark:bg-gray-800 p-0">
        <div
          :class="
            'flex-row gap-2 flex justify-between items-center py-2 m-1 border-gray-200 border-2  px-2 h-full'
          "
        >
          <div class="flex-shrink-0 w-12">
            <a href="" class="block relative">
              <img
                v-if="photo"
                :alt="username"
                :src="photo"
                class="mx-auto object-cover rounded-full h-12 w-12"
              />
              <TIcon v-else-if="!photo" name="people" />
            </a>
          </div>
          <div class=" flex flex-col w-full">
            <span>
              <!-- {{ role }} -->
              Name
              <TInputTextarea v-model="username" auto-focus rows="1" />
            </span>
            <span
              >Bio
              <TInputTextarea
                v-model="bio"
                :rows="bio.length / 17"
                class="py-2"
              />
            </span>
            <span
              >Role
              <TInputTextarea v-model="role" rows="1" />
            </span>
          </div>
        </div>
        <button
          type="button"
          class="float-right text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TBioModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
  setup() {
    return {}
  },
}
</script>
