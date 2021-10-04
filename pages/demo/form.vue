<template>
  <div class="p-4 space-y-4">
    <h2 class="text-lg font-bold">Demo: Form</h2>
    <TForm
      v-model="data"
      :fields="fields"
      :field-config="{ labelPosition: 'top' }"
      class="space-y-4"
      submit-label="Submit"
      @save="submit"
    />
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
export default {
  name: 'Form',
  setup() {
    const data = ref({
      name: '',
      email: '',
      username: '',
      place: ''
    })
    const fields = [
      {
        name: 'name',
        key: 'account.name',
        validations: {
          required: true,
          minLength: 3
        }
      },
      {
        name: 'email',
        key: 'account.email',
        validations: {
          required: true,
          email: true
        }
      },
      {
        name: 'username',
        key: 'profile.username',
        type: 'username',
        before: 'Use only letters, numbers, underscores and periods.',
        validations: {
          required: true,
          minLength: 4,
          alphaNum: true,
          isUnique: true
        }
      },
      {
        name: 'place',
        label: 'Your city',
        type: 'place',
        placeholder: 'City',
        validations: {
          required: true
        }
      }
    ]
    return {
      data,
      fields
    }
  },
  methods: {
    submit(data) {
      console.log('submited', data)
    }
  }
}
</script>
