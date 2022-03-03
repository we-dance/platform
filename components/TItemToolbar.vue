<template>
  <div v-if="can('edit', collection, item)" class="flex justify-end space-x-2">
    <TButton
      v-if="dashboard"
      icon="people"
      :to="`/${collection}/${item.id}/dashboard`"
      class="mr-2 hover:text-blue-500"
      :label="$('post.dashboard')"
    />
    <TButton
      v-if="edit"
      icon="edit"
      :to="`/${collection}/${item.id}/edit`"
      class="hover:text-blue-500"
      :label="$t('post.edit')"
    />
    <slot />
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  name: 'TItemToolbar',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    collection: {
      type: String,
      default: '',
    },
    dashboard: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { can } = useAuth()

    return {
      can,
    }
  },
}
</script>
