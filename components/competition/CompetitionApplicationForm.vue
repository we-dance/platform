<template>
  <div>
    <h1 class="text-xl font-extrabold p-4 text-center border-b">
      Enter the Contest
    </h1>
    <div class="p-4">
      <TForm
        ref="formRef"
        v-model="application"
        :fields="fields"
        class="space-y-4"
        hide-submit
      />
    </div>
    <div class="flex justify-center pb-4">
      <TButton type="primary" @click="submit">Join the Contest</TButton>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root }) {
    const application = ref({})
    const formRef = ref(null)
    const { uid, profile } = useAuth()

    const fields = ref([
      {
        name: 'city',
        label: 'City',
        required: true,
        component: 'TInputPlace',
        before: 'Where are you shooting the video?',
        labelPosition: 'top',
      },
      {
        name: 'style',
        label: 'Dance style',
        labelPosition: 'top',
        before: 'Choose the dance style',
        component: 'TInputStyle',
        required: true,
      },
      {
        name: 'category',
        label: 'Category',
        labelPosition: 'top',
        before: 'Choose the category',
        component: 'TInputButtons',
        options: [
          { value: 'couple', label: 'Couple' },
          { value: 'solo', label: 'Solo' },
          { value: 'group', label: 'Group' },
        ],
        required: true,
      },
      {
        name: 'partner',
        component: 'TInputProfile',
        label: 'Partner',
        before: 'Choose your partner',
        labelPosition: 'top',
        when: (profile) => profile.category === 'couple',
        required: true,
      },
      {
        name: 'rules',
        label: 'I have read and agree to the rules',
        before:
          'Please review the competition rules before submitting your entry. You can find the complete rules [here](/competition/rules).',
        component: 'TCheckbox',
        hideLabel: true,
        validate(value) {
          return value
        },
        validationError: 'You must agree to the rules',
      },
    ])

    async function submit() {
      if (!(await formRef.value.validate())) {
        root.$track('competition_application_error')
        return
      }

      await db
        .collection('competition')
        .doc(uid.value)
        .set({
          ...application.value,
          uid: uid.value,
          username: profile.username,
          name: profile.name,
          photo: profile.photo,
          createdAt: +new Date(),
        })

      root.$track('competition_application')
    }

    return {
      formRef,
      application,
      fields,
      submit,
    }
  },
}
</script>
