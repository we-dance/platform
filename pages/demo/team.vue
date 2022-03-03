<template>
  <div class="space-y-4 p-4">
    <TField
      v-model="single"
      component="TInputProfile"
      label="Organiser"
      label-position="top"
    />

    <TField
      v-model="multiple"
      component="TInputArray"
      :children="{
        component: 'TInputProfile',
        excludeUsernames: multiple
          .filter((item) => !!item)
          .map((item) => item.username),
      }"
      label="Team"
      label-position="top"
    />

    <div class="space-y-2">
      <WProfile
        v-for="profile in multiple"
        :key="profile.username"
        :username="profile.username"
        :fallback="profile"
      />
    </div>

    <div class="font-bold">single</div>
    <textarea
      :value="JSON.stringify(single, null, 2)"
      :rows="10"
      class="mt-4 w-full border font-mono text-xs"
    ></textarea>

    <div class="font-bold">multiple</div>
    <textarea
      :value="JSON.stringify(multiple, null, 2)"
      :rows="30"
      class="mt-4 w-full border font-mono text-xs"
    ></textarea>
  </div>
</template>

<script>
export default {
  data: () => ({
    multiple: [],
    single: null,
  }),
}
</script>
