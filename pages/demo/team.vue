<template>
  <div class="p-4">
    <TField
      type="profiles"
      v-model="winners"
      label="Team"
      label-position="top"
    />
    <textarea
      :value="JSON.stringify(winners, null, 2)"
      :rows="30"
      class="mt-4 w-full border text-xs font-mono"
    ></textarea>
  </div>
</template>

<script>
export default {
  data: () => ({
    winners: [
      {
        username: 'alejito',
        name: '',
        photo:
          'https://firebasestorage.googleapis.com/v0/b/wedance-4abe3.appspot.com/o/media%2FtvR012ArEpQhCJdPHh6G7sLuqoO2%2F85cc5d77-6212-4707-85e0-24bdf72b1c7c?alt=media&token=2872dc07-fa22-46b7-8f0e-41c935fc6345',
        bio: 'Founder of WeDance',
        role: 'Dancer',
        description: '',
      },
    ],
  }),
}
</script>
