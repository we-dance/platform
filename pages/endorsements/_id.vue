<template>
  <div v-if="loading || !exists || !item"></div>
  <div v-else class="bg-gray-800">
    <div
      class="max-w-lg mx-auto min-h-screen text-lg leading-loose flex items-center"
    >
      <div class="bg-white p-4 rounded">
        <img
          class="float-right rounded-full w-12 h-12"
          :src="getAccount(item.createdBy).photo"
        />
        <div>Hi, {{ item.name }}!</div>
        <div>
          <span class="text-blue-500">{{
            getAccount(item.createdBy).name
          }}</span>
          danced
          <span class="text-blue-500">{{ getFirst(item.genre) }}</span> with you
          <span class="text-blue-500">{{ dateDiff(item.when) }} ago</span> and
          sent you an endorsement, which you can see after you do the same.
        </div>
        <div class="flex justify-end leading-normal">
          <TButton>Reply</TButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDoc } from '~/use/doc'
import { useCollection } from '~/use/collection'
import { useRouter } from '~/use/router'
import { dateDiff } from '~/utils'

export default {
  layout: 'empty',
  setup() {
    const { params } = useRouter()
    const { doc: item, load, exists, loading } = useDoc('endorsements')
    const { getById: getAccount } = useCollection('accounts')

    const getFirst = (obj) => {
      return obj ? Object.keys(obj)[0] : ''
    }

    if (params.id) {
      load(params.id)
    }

    return {
      item,
      exists,
      loading,
      getAccount,
      getFirst,
      dateDiff,
    }
  },
}
</script>
