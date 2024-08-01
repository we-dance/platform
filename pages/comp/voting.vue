<template>
  <div>
    <div class="p-4 pb-0">
      <h1 class="text-3xl font-extrabold text-center">
        Cast Your Votes Now!
      </h1>
      <div class="text-gray-700">
        Each voter has 5 votes and can give a maximum of 3 votes to a single
        video. Voting is open until August 28th.
      </div>
    </div>
    <TLoader v-if="loading" />
    <div v-else class="flex flex-col gap-4 p-4">
      <CompetitionVideo
        v-for="application in applications"
        :key="application.id"
        :application="application"
        :total-votes="totalVotes"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from '@nuxtjs/composition-api'
import { sortBy } from 'lodash'
import { db } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  setup() {
    const applications = ref([])
    const loading = ref(true)
    const { uid } = useAuth()

    const totalVotes = computed(() =>
      applications.value.reduce((acc, application) => {
        return (
          acc + (application?.votes ? application.votes[uid.value] || 0 : 0)
        )
      }, 0)
    )

    onMounted(() => {
      db.collection('competition').onSnapshot((snapshot) => {
        const docs = []
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() })
        })
        applications.value = sortBy(docs, 'videoUploadedAt')
        loading.value = false
      })
    })

    return {
      applications,
      loading,
      totalVotes,
    }
  },
}
</script>
