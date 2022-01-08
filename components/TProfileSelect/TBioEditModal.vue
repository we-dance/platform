<template>
  <div class="m-2">
    <div class="py-2 m-1 px-2">
      <div class="flex w-full justify-center">
        <router-link :to="'/' + username">
          <img
            v-if="photo"
            :alt="username"
            :src="photo"
            class="mx-auto object-cover rounded-full h-12 w-12"
          />
          <TIcon v-else-if="!photo" name="people" />
        </router-link>
      </div>
      <div class=" flex flex-col w-full">
        <span>
          Name
          <TInputTextarea v-model="username" auto-focus rows="1" />
        </span>
        <span
          >Bio
          <TInputTextarea
            v-model="bio"
            :rows="bio.length / 17 + 2"
            class="py-2"
          />
        </span>
        <span
          >Role
          <TInputTextarea v-model="role" rows="1" />
        </span>
      </div>
    </div>
    <div class="flex justify-between">
      <TButton type="base" class="text-sm" @click="$emit('close')">
        Cancel
      </TButton>
      <TButton type="success" class="text-sm" @click="$emit('saveedit')">
        Save
      </TButton>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TBioEditModal',
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
  },
}
</script>
