<template>
  <TPopup
    v-if="showAuthPopup"
    :title="$t('popup.auth.title')"
    @close="showAuthPopup = false"
  >
    <div class="my-4 w-64 flex flex-col justify-center text-center">
      <div class="p-4">
        {{ $t('popup.auth.body', { action: showAuthPopup }) }}
      </div>
      <TButton
        allow-guests
        class="mt-2"
        type="primary"
        :to="localePath(`/signin?target=${$route.path}`)"
        >{{ $t('popup.auth.signin') }}</TButton
      >
    </div>
  </TPopup>
  <div v-else></div>
</template>

<script>
import ls from 'local-storage'
import { useAuth } from '~/use/auth'

export default {
  setup() {
    const { showAuthPopup, authTargetQuery } = useAuth()

    if (authTargetQuery.value) {
      ls('action', authTargetQuery.value)
    }

    return {
      showAuthPopup,
    }
  },
}
</script>
