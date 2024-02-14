<template>
  <div>
    <TCityHeader :profile="city" view="tips" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">Ask {{ city.name }}</h1>
      <div class="text-sm">
        Find real-time recommendations and get local insights directly from
        dancers from
        {{ city.name }}. Choose your preferred dance style for tailored tips, or
        ask the community for personalized recommendations. Expect responses
        typically within 48 hours.
      </div>
    </div>

    <div class="border-b border-t p-4">
      <form class="flex flex-col gap-4 w-full" @submit.prevent="saveItem">
        <div class="flex gap-4">
          <TField
            v-model="item.style"
            label-position="top"
            placeholder="Dance style"
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
          label-position="top"
          component="TInputTextarea"
          :placeholder="`Ask for recommendations in ${city.name}`"
        />
        <div v-if="showForm" class="flex justify-end gap-2">
          <TButton xtype="submit" variant="primary">Post</TButton>
        </div>
      </form>
    </div>

    <TStories :place="city.cityPlaceId" />
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'

export default {
  name: 'ExploreTips',
  props: {
    city: {
      type: Object,
      default: () => ({}),
    },
    createdBy: {
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
        place: this.city.cityPlaceId,
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
