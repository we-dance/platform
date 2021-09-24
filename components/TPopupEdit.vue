<template>
  <div
    v-if="can('edit', collection, item)"
    class="mb-2 flex items-start justify-center"
  >
    <TButton
      :icon="icon"
      :type="type"
      :label="label"
      @click="isPopupOpen = true"
    />

    <TPopup
      v-if="isPopupOpen"
      :title="title || label"
      @close="isPopupOpen = false"
    >
      <div class="max-w-md mx-auto py-4 max-h-screen overflow-y-scroll">
        <TItemEdit
          :id="item.id"
          :title="title"
          save-label="Save"
          add-label="Add"
          :show-remove="showRemove"
          :collection="collection"
          :singular="singular"
          :fields="fields"
          @save="$emit('save')"
          @cancel="isPopupOpen = false"
        />
      </div>
    </TPopup>
  </div>
</template>

<script>
import { useAuth } from '~/use/auth'

export default {
  name: 'TPopupEdit',
  props: {
    type: {
      type: String,
      default: 'simple',
    },
    icon: {
      type: String,
      default: 'edit',
    },
    collection: {
      type: String,
      default: '',
    },
    singular: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: () => [],
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isPopupOpen: false,
  }),
  setup() {
    const { can } = useAuth()

    return {
      can,
    }
  },
}
</script>
