<template>
  <div>
    <THeader title="Feed" />
    <div class="border-b p-4 flex items-start">
      <div class="w-12 flex-shrink-0">
        <TAvatar photo size="md" :uid="uid" />
      </div>
      <div class="flex-grow">
        <div class="w-full bg-gray-200 p-4 rounded text-sm text-gray-900">
          What's on your mind?
        </div>
      </div>
    </div>
    <TPostList :filter="{ place: currentCity }" />
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'
import { useCities } from '~/use/cities'

export default {
  setup() {
    const { uid } = useAuth()
    const { currentCity } = useCities()

    return { currentCity, uid }
  },
}
</script>
