<template>
  <div>
    <TPopup v-if="editing" title="Edit Review" @close="editing = false">
      <TForm
        v-model="internalValue"
        :fields="review"
        show-remove
        @remove="
          (val) => {
            $emit('input', null)
            editing = false
          }
        "
        @save="
          (val) => {
            $emit('input', val)
            editing = false
          }
        "
      />
    </TPopup>
    <div
      v-if="value.description"
      class="p-2 hover:bg-gray-200 cursor-pointer"
      @click="
        internalValue = value
        editing = true
      "
    >
      <TReview :item="value" />
    </div>
    <div v-else class="p-2">
      <TButton label="Add review" @click="editing = true" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue-demi'

export default {
  name: 'TInputReview',
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: null,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    editing: false,
    internalValue: {},
  }),
  setup(props) {
    const review = computed(() => [
      {
        name: 'stars',
        labelPosition: 'top',
        label: 'Rating (0-5)',
      },
      {
        name: 'description',
        label: 'Description',
        labelPosition: 'top',
        component: 'TInputTextarea',
        max: 140,
      },
      {
        name: 'author',
        component: 'TInputProfile',
        label: 'Author',
        labelPosition: 'top',
      },
      {
        name: 'link',
        labelPosition: 'top',
        label: 'Link to source',
      },
      {
        name: 'createdAt',
        component: 'DatePicker',
        labelPosition: 'top',
        type: 'datetime',
        format: 'YYYY-MM-DDTHH:mm',
        'time-picker-options': {
          start: '00:00',
          step: '00:30',
          end: '23:30',
          format: 'HH:mm',
        },
        'value-type': 'format',
        label: 'Date',
        simple: true,
      },
    ])

    return { review }
  },
}
</script>
