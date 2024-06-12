<template>
  <div class="relative mb-4">
    <TForm
      v-if="isEditing"
      v-model="internalValue"
      :fields="fields"
      show-cancel
      @cancel="isEditing = false"
      @save="
        $emit('input', internalValue)
        isEditing = false
      "
    />
    <div v-else-if="value.title">
      <LandingFeature
        :title="value.title"
        :description="value.description"
        :button="value.primaryButton"
        :url="value.primaryUrl"
      />
      <div class="mt-4 flex gap-4">
        <TButton label="Edit" @click="isEditing = true" />
        <TButton label="Delete" @click="$emit('input', '')" />
      </div>
    </div>
    <TButton v-else label="Add Offer" @click="isEditing = true" />
  </div>
</template>
<script>
export default {
  name: 'TInputOffer',
  inheritAttrs: false,
  props: {
    value: {
      type: [Object, String],
      default: '',
    },
  },
  data() {
    return {
      internalValue: this.value,
      isEditing: false,
    }
  },
  setup(props) {
    const fields = [
      {
        name: 'title',
        labelPosition: 'top',
      },
      {
        name: 'description',
        labelPosition: 'top',
        component: 'TInputTextarea',
      },
      {
        name: 'primaryButton',
        labelPosition: 'top',
      },
      {
        name: 'primaryUrl',
        labelPosition: 'top',
      },
    ]

    return { fields }
  },
}
</script>
