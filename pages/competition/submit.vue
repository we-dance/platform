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
    <div class="p-4 text-xs text-center">
      If you have any problems please
      <a
        class="text-primary underline hover:no-underline"
        href="mailto:support@wedance.vip"
        >contact support</a
      >.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  layout: 'full',
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
      loading,
    }
  },
}
</script>
