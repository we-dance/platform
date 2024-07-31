<template>
  <div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Cast Your Votes Now!
      </h1>
      <div class="text-gray-700">
        Each voter has 5 votes per dance style and can give a maximum of 3 votes
        to a single video. Voting is open until August 28th.
      </div>
    </div>
    <TLoader v-if="loading" />
    <div v-else>
      <CompetitionVideo
        v-for="application in applications"
        :key="application.id"
        :application="application"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'

export default {
  setup() {
    const applications = ref([])
    const loading = ref(true)

    onMounted(() => {
      db.collection('competition')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            applications.value.push({ ...doc.data(), id: doc.id })
          })
        })
        .finally(() => {
          loading.value = false
        })
    })

    function vote() {
      console.log('Voted')
    }

    return {
      applications,
      loading,
      vote,
    }
  },
}
</script>
