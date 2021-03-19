<template>
  <div v-if="can('edit', collection, item)" class="mb-2 flex justify-end">
    <TButton
      v-if="dashboard"
      icon="people"
      :to="`/${collection}/${item.id}/dashboard`"
      class="hover:text-blue-500 mr-2"
      label="Dashboard"
    />
    <TButton
      icon="edit"
      :to="`/${collection}/${item.id}/edit`"
      class="hover:text-blue-500"
      label="Edit"
    />
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  name: 'TItemToolbar',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    collection: {
      type: String,
      default: ''
    },
    dashboard: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { can } = useAuth()

    return {
      can
    }
  }
}
</script>
