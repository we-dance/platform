<template>
  <div class="border-b border-t p-4">
    <form class="flex flex-col gap-4 w-full" @submit.prevent="saveItem">
      <div class="flex gap-4">
        <TField
          v-model="item.style"
          label-position="top"
          placeholder="Any Dance"
          component="TInputStyle"
          popular-only
        />
        <TButton
          v-if="!showForm"
          type="primary"
          class="flex-grow w-full"
          @click="showForm = true"
          >Ask for recommendations</TButton
        >
      </div>
      <TField
        v-if="showForm"
        v-model="item.description"
        required
        label-position="top"
        component="TInputTextarea"
        placeholder="Ask for recommendations"
      />
      <div v-if="showForm" class="flex justify-end gap-2">
        <TButton xtype="submit" variant="primary">Post</TButton>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'

export default {
  name: 'TQuestionForm',
  props: {
    place: {
      type: String,
      default: '',
    },
  },
  methods: {
    async saveItem() {
      let data = this.item
      this.item = {}

      data = {
        ...data,
        place: this.place || data.place || '',
        createdAt: +new Date(),
        createdBy: this.uid,
        username: this.profile.username,
        type: 'ask-for-recommendations',
      }

      const firestore = firebase.firestore()
      await firestore.collection('stories').add(data)
    },
  },
  setup() {
    const { uid, profile } = useAuth()
    const item = ref({})
    const showForm = ref(false)

    return {
      showForm,
      item,
      profile,
      uid,
    }
  },
}
</script>
