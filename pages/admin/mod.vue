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
    }
  },
}
</script>

<template>
  <div class="p-4 space-y-4">
    <TField v-model="usernameOld" label="Old username" />
    <TField v-model="usernameNew" label="New username" />
    <TButton @click="moveEvents">Move Events</TButton>
  </div>
</template>
