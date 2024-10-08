<template>
  <div>
    <div class="p-4 pb-0">
      <h1 class="text-3xl font-extrabold text-center">
        Cast Your Votes Now!
      </h1>
      <div class="text-gray-700">
        Each voter has 5 votes and can give a maximum of 3 votes to a single
        video. You can see only your votes. You can change your votes until the
        end of the voting period. Voting period is until August 28th. Results
        will be announced on September 1st.
      </div>
    </div>
    <TLoader v-if="loading" />
    <div v-else class="flex flex-col gap-4 p-4">
      <CompetitionVideo
        v-for="application in applications"
        :key="application.id"
        :application="application"
        :user-votes="userVotes"
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
  layout: 'full',
  setup() {
    const applications = ref([])
    const loading = ref(true)
    const { uid } = useAuth()

    const userVotes = computed(() =>
      applications.value.reduce((acc, application) => {
        return (
          acc + (application?.votes ? application.votes[uid.value] || 0 : 0)
        )
      }, 0)
    )

    onMounted(() => {
      db.collection('competition').onSnapshot((snapshot) => {
        const docs = []
        snapshot.forEach((docRef) => {
          const doc = { id: docRef.id, ...docRef.data() }
          if (doc.video) {
            docs.push(doc)
          }
        })
        applications.value = sortBy(docs, 'videoUploadedAt')
        loading.value = false
      })
    })

    return {
      applications,
      loading,
      userVotes,
    }
  },
}
</script>
