<template>
  <div>
    <div class="md:flex items-baseline justify-between mb-4">
      <h1 class="text-xl font-bold">Videos</h1>
    </div>

    <div class="mt-4 mx-auto max-w-md p-4 text-sm">
      <TIcon name="undraw_video_files" class="p-4" />
      <div>
        Dance videos directory.
      </div>
      <div v-if="!uid" class="mt-8 bg-gray-400 p-4 rounded text-center">
        <div>Sign in to continue</div>
        <TButton class="mt-2" to="/signin?target=/trips">Sign in</TButton>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  setup() {
    const { uid } = useAuth()

    return {
      uid
    }
  }
}
</script>
