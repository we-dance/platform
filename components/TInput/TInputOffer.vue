<template>
  <div class="relative">
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
      <div>{{ value }}</div>
      <TButton label="Edit" @click="isEditing = true" />
    </div>
    <TButton v-else label="Add Offer" @click="isEditing = true" />
  </div>
</template>
<script>
import { ref } from 'vue'

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
        name: 'primaryAction',
        labelPosition: 'top',
      },
    ]

    return { fields }
  },
}
</script>
