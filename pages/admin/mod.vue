<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ref } from 'vue-demi'

export default {
  middleware: ['auth'],
  setup() {
    const firestore = firebase.firestore()

    const usernameOld = ref('')
    const usernameNew = ref('')

    async function moveProfile() {
      const profileRef = await firestore
        .collection('profiles')
        .doc(usernameOld.value)
        .get()

      const profile = profileRef.data()

      await firestore
        .collection('profiles')
        .doc(usernameNew.value)
        .update({
          photo: profile.photo,
          bio: profile.bio,
        })

      console.log('Moved profile:', profile)
    }

    async function moveArtist() {
      const eventsRefs = await firestore
        .collection('posts')
        .where('artistsList', 'array-contains', usernameOld.value)
        .get()

      const events = eventsRefs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      let i = 0
      for (const event of events) {
        i++
        console.log(`Moving event ${i}/${events.length}`)
        const artistsList = event.artistsList.map((artist) =>
          artist === usernameOld.value ? usernameNew.value : artist
        )

        const artists = event.artists.map((artist) => {
          if (artist.username === usernameOld.value) {
            return {
              ...artist,
              username: usernameNew.value,
            }
          }
          return artist
        })

        await firestore
          .collection('posts')
          .doc(event.id)
          .update({
            artistsList,
            artists,
          })
      }
    }

    async function moveEvents() {
      const eventsRefs = await firestore
        .collection('posts')
        .where('org.username', '==', usernameOld.value)
        .get()

      const events = eventsRefs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      for (const event of events) {
        await firestore
          .collection('posts')
          .doc(event.id)
          .update({
            org: {
              username: usernameNew.value,
            },
          })
      }

      console.log('Moved events:', events.length)
    }

    return {
      usernameOld,
      usernameNew,
      moveEvents,
      moveProfile,
      moveArtist,
    }
  },
}
</script>

<template>
  <div class="p-4 space-y-4">
    <TField v-model="usernameOld" label="Old username" />
    <TField v-model="usernameNew" label="New username" />
    <TButton @click="moveEvents">Move Events</TButton>
    <TButton @click="moveArtist">Move Artist</TButton>
    <TButton @click="moveProfile">Move Profile</TButton>
  </div>
</template>
