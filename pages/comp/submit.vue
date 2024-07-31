<template>
  <div>
    <TLoader v-if="loading" />
    <CompetitionApplicationForm
      v-else-if="!application.createdAt"
      :value="application"
    />
    <CompetitionVideoForm
      v-else-if="!application.videoUploadedAt"
      :value="application"
    />
    <CompetitionSubmitted v-else />
  </div>
</template>

<script>
import { ref, onMounted } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  setup(props, { root }) {
    const application = ref({})
    const loading = ref(true)
    const { uid } = useAuth()

    onMounted(() => {
      db.collection('competition')
        .doc(uid.value)
        .onSnapshot((doc) => {
          loading.value = false

          if (!doc.exists) {
            return
          }

          application.value = doc.data()
        })
    })

    return {
      application,
    }
  },
}
</script>
