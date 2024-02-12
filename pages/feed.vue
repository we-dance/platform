<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="p-4">
      <h1 class="text-2xl font-bold">Ask {{ cityName }}</h1>
      <div class="text-sm">
        Explore our community feed for real-time recommendations and dance event
        insights from dancers worldwide.
      </div>
    </div>

    <div class="border-b">
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
          :placeholder="`Ask for recommendations in ${cityName}`"
        />
        <div class="flex justify-end gap-2">
          <TButton xtype="submit" variant="primary">Post</TButton>
        </div>
      </form>
    </div>

    <TStories :place="currentCity" />
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  name: 'Feed',
  methods: {
    async saveItem() {
      let data = this.item
      this.item = {}

      data = {
        ...data,
        place: this.currentCity,
        createdAt: +new Date(),
        createdBy: this.uid,
        username: this.profile.username,
        type: 'ask-for-recommendations',
      }

      const firestore = firebase.firestore()
      await firestore.collection('stories').add(data)
    },
  },
  setup(props, { root }) {
    const { uid, profile } = useAuth()
    const { currentCity, cityName } = useCities()
    const item = ref({})

    return {
      item,
      currentCity,
      cityName,
      profile,
      uid
    }
  },
}
</script>
