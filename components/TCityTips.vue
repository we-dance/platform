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

    <div class="border-b border-t">
      <form class="flex flex-col gap-4 p-4" @submit.prevent="saveItem">
        <TField
          v-model="item.style"
          label="Dance style"
          label-position="top"
          placeholder="Select dance style"
          component="TInputStyle"
          popular-only
        />
        <TField
          v-model="item.description"
          label-position="top"
          component="TInputTextarea"
          :placeholder="`Ask for recommendations in ${city.name}`"
        />
        <div class="flex justify-end gap-2">
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

    return {
      item,
      profile,
      uid,
    }
  },
}
</script>
