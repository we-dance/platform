<template>
  <div>
    <h1 class="text-xl font-extrabold p-4 text-center border-b">
      Complete Profile
    </h1>
    <div class="p-4">
      <TForm
        v-model="profile"
        :fields="profileFields"
        class="space-y-4"
        hide-submit
      />
    </div>
    <div class="flex justify-center pb-4">
      <TButton type="primary" to="/find-partner/">Find Matches</TButton>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    profile: {},
  }),
  setup() {
    const profileFields = [
      {
        name: 'photo',
        labelPosition: 'top',
        label: 'Profile Photo',
        before:
          'Upload a clear, recent photo of yourself. This helps others recognize you.',
        poster: true,
        component: 'TInputPhoto',
      },
      {
        name: 'partnerBio',
        label: 'I am looking for',
        labelPosition: 'top',
        component: 'TInputTextarea',
        placeholder: '',
        before: "Describe the type of dance partner you're seeking.",
      },
      {
        name: 'styles',
        label: 'Dance styles',
        labelPosition: 'top',
        before: 'Choose the dance styles you are interested in.',
        poster: true,
        component: 'TInputStylesSelect2',
      },
    ]

    return {
      profileFields,
    }
  },
}
</script>
