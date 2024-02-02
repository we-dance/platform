<template>
  <div>
    <h1 class="text-xl font-extrabold p-4 text-center border-b">
      Complete Profile
    </h1>
    <div class="p-4">
      <TForm
        ref="formRef"
        v-model="profile"
        :fields="profileFields"
        class="space-y-4"
        hide-submit
      />
    </div>
    <div class="flex justify-center pb-4">
      <TButton type="primary" @click="submit">Find Matches</TButton>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { useAuth } from '~/use/auth'
import { useRouter } from '~/use/router'

export default {
  setup() {
    const { profile, updateProfile } = useAuth()
    const { router } = useRouter()
    const formRef = ref(null)

    const profileFields = ref([
      {
        name: 'searchStyle',
        label: 'Dance style',
        labelPosition: 'top',
        before: 'Choose the dance style you are interested in.',
        component: 'TInputStyle',
        popularOnly: true,
        required: true,
      },
      {
        name: 'searchLevel',
        label: 'Dance Experience Level',
        labelPosition: 'top',
        component: 'TInputButtons',
        required: true,
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ],
        before:
          "Indicate your current dance proficiency to ensure the best match with a partner. If you're new to dancing or still learning the basics, select 'Beginner.' 'Intermediate' suits those who are comfortable with basic steps and have some practice. Choose 'Advanced' if you're experienced and can handle complex routines",
        placeholder: 'Select Experience Level',
      },
      {
        name: 'role',
        label: 'Dance Role',
        required: true,
        labelPosition: 'top',
        component: 'TInputButtons',
        options: [
          { value: 'leader', label: 'Leader' },
          { value: 'follower', label: 'Follower' },
        ],
        before:
          'Choose your preferred dance role. Traditionally in many dance forms, men often take the role of the Leader, who initiates and guides the movements, while women usually follow as the Follower, responding to the Leader’s direction. Select the role that best suits your style and comfort.',
        placeholder: 'Select Role',
      },
      {
        name: 'place',
        label: 'My City',
        required: true,
        component: 'TInputPlace',
        before: 'Where are you looking for dance partner?',
        labelPosition: 'top',
      },
      {
        name: 'story',
        label: 'About Me',
        required: true,
        labelPosition: 'top',
        component: 'TInputTextarea',
        placeholder: '',
        before:
          'Share your dance journey and interests. This is your chance to tell others about your passion for dance, your experiences, and what makes you unique. This personal touch can spark a connection with potential dance partners.',
      },
      {
        name: 'partnerBio',
        required: true,
        label: 'I am looking for',
        labelPosition: 'top',
        component: 'TInputTextarea',
        placeholder: '',
        before: "Describe the type of dance partner you're seeking.",
      },
      {
        name: 'photo',
        required: true,
        labelPosition: 'top',
        label: 'Profile Photo',
        before:
          'Upload a clear, recent photo of yourself. This helps others recognize you.',
        poster: true,
        component: 'TInputPhoto',
      },
    ])

    async function submit() {
      if (!formRef.value.validate()) {
        window.alert('Please fill all required fields')
        return
      }

      profile.value.partner = 'Yes'
      profile.value.searchStartedAt = +new Date()
      profile.value.searchExpiresAt = +new Date() + 7 * 24 * 60 * 60 * 1000

      await updateProfile(profile.value)

      router.push('/find-partner/')
    }

    return {
      formRef,
      profile,
      profileFields,
      submit,
    }
  },
}
</script>
