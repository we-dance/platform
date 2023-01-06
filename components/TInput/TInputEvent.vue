<template>
  <div>
    <TPopup v-if="editing" title="Edit Program Item" @close="editing = false">
      <TForm
        v-model="internalValue"
        :fields="subEvent"
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
      v-if="value.eventType"
      class="p-2 hover:bg-gray-200 cursor-pointer"
      @click="
        internalValue = value
        editing = true
      "
    >
      <TAgendaItem :item="value" />
    </div>
    <div v-else class="p-2">
      <TButton label="Add item" @click="editing = true" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue-demi'
import { useEvents } from '~/use/events'

export default {
  name: 'TInputEvent',
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
  beforeUpdate() {
    if (!this.internalValue?.startDate) {
      this.internalValue = {
        startDate: this.item.startDate,
        endDate: this.item.startDate,
        eventType: 'Party',
      }
    }
  },
  setup(props) {
    const { eventTypeList } = useEvents()

    const subEvent = computed(() => [
      {
        name: 'eventType',
        label: 'Type',
        labelPosition: 'top',
        component: 'TInputSelect',
        options: eventTypeList,
      },
      {
        name: 'name',
        labelPosition: 'top',
        label: 'Name',
      },
      {
        name: 'description',
        label: 'Description',
        labelPosition: 'top',
        component: 'TInputTextarea',
        max: 140,
      },

      {
        name: 'startDate',
        component: 'DatePicker',
        type: 'time',
        format: 'YYYY-MM-DDTHH:mm',
        'minute-step': 5,
        'value-type': 'format',
        labelPosition: 'top',
        label: 'Start',
        simple: true,
      },
      {
        name: 'endDate',
        component: 'DatePicker',
        type: 'time',
        format: 'YYYY-MM-DDTHH:mm',
        'minute-step': 5,
        'value-type': 'format',
        labelPosition: 'top',
        label: 'End',
        simple: true,
      },
      {
        name: 'artists',
        component: 'TMultiObjects',
        options: props.item.artists,
        valueField: 'username',
        labelField: 'username',
        label: 'Artists',
        labelPosition: 'top',
      },
    ])

    return { subEvent }
  },
}
</script>
