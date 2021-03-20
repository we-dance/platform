<template>
  <TCardList v-bind="config" />
</template>

<script>
import { getOptionsFromArray } from '~/utils'

export default {
  name: 'SuspendedIndex',
  setup() {
    const config = {
      collection: 'suspended',
      title: 'Suspended',
      empty: 'Nothing here',
      fields: getOptionsFromArray(['username', 'reason', 'email', 'deletedAt'])
    }

    return {
      config
    }
  }
}
</script>
