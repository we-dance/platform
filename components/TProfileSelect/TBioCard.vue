<template>
  <div
    class="rounded-2xl bg-white dark:bg-gray-800 p-0"
    v-bind="$attrs"
    @click="$listeners.select"
  >
    <div
      :class="[
        { 'hover:bg-gray-200 cursor-pointer': !showTools },
        'flex-row gap-2 flex justify-between items-center py-2 m-1 border-gray-200 border-2  px-2 h-full',
      ]"
    >
      <div class="flex-shrink-0 w-12">
        <a href="#" class="block relative">
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
        <span
          v-if="username"
          class="text-gray-600 dark:text-white text-lg font-medium"
        >
          {{ username }}
        </span>
        <span v-if="bio" class="text-gray-600 text-xs h-fit">
          {{ bio }}
        </span>
        <span v-if="role" class="text-gray-800 text-xs">
          {{ role }}
        </span>
      </div>
      <div
        v-if="showTools"
        class="flex gap-1 sm:w-24 w-12 sm:flex-row flex-col items-start justify-between h-full p-4"
      >
        <TButton
          icon="delete"
          type="icon"
          class="pr-2"
          @click="$listeners.remove"
        />
        <TButton
          icon="edit"
          type="icon"
          class="pr-2"
          @click="$listeners.edit"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TBioCard',
  props: {
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
    showTools: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
