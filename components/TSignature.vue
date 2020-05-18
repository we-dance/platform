<template>
  <div class="text-sm flex">
    <img
      class="rounded-full w-10 h-10 mr-2 mb-2"
      :src="getAccount(item.createdBy).photo"
    />
    <div>
      <router-link
        :to="`/u/${getAccount(item.createdBy).username}`"
        class="font-bold"
        >{{ getAccount(item.createdBy).name }}</router-link
      >
      <div class="text-gray-600">{{ getDateTime(item.createdAt) }}</div>
    </div>
  </div>
</template>

<script>
import useCollection from '~/use/collection'
import { getDateTime } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { getById } = useCollection('accounts')
    const getAccount = (uid) => getById(uid) || {}

    return {
      getAccount,
      getDateTime
    }
  }
}
</script>
