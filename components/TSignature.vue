<template>
  <div class="text-sm flex items-center">
    <img
      :class="`rounded-full mr-2 ${classes}`"
      :src="getAccount(item.createdBy).photo"
    />
    <div :class="small ? 'flex justify-between w-full' : ''">
      <router-link
        class="hover:underline"
        :to="`/u/${getAccount(item.createdBy).username}`"
        >{{ getAccount(item.createdBy).name }}</router-link
      >
      <div class="text-gray-600">{{ getDateTime(item.createdAt) }}</div>
    </div>
  </div>
</template>

<script>
import useAccounts from '~/use/accounts'
import { getDateTime } from '~/utils'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { getAccount } = useAccounts()

    return {
      getAccount,
      getDateTime
    }
  },
  computed: {
    classes() {
      if (this.small) {
        return 'w-4 h-4'
      }

      return 'w-10 h-10'
    }
  }
}
</script>
