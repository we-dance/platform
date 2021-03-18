<template>
  <div class="mb-2 flex items-start justify-center">
    <TButton
      icon="edit"
      class="hover:text-blue-500"
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
          :id="id"
          :title="title"
          save-label="Save"
          add-label="Add"
          :collection="collection"
          :singular="singular"
          :fields="fields"
          @cancel="isPopupOpen = false"
        />
      </div>
    </TPopup>
  </div>
</template>

<script>
export default {
  props: {
    collection: {
      type: String,
      default: ''
    },
    singular: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    isPopupOpen: false
  })
}
</script>
