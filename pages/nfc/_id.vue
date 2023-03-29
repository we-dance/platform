<template>
  <main>
    <div>Redirecting</div>
    <div>
      {{ docSnap }}
    </div>
  </main>
</template>

<script>
import { db } from '~/plugins/firebase'

export default {
  async asyncData() {
    const pageId = $nuxt.$route.params.id
    const docRef = db.collection('profiles').doc(pageId)
    await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          $nuxt.$router.push(`/${doc.data().username}`)
        } else {
          console.log('No such document!')
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error)
      })
  },
}
</script>
