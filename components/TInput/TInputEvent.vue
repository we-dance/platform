<!-- components/TInput/TInputEvent.vue -->
<template>
  <div>
    <TPopup
      v-if="showEdit"
      title="Edit"
      @close="showEdit = !showEdit"
      allow-guests
    >
      <TForm
        v-model="value"
        :fields="schema"
        @save="showEdit = !showEdit"
        allow-guests
        class="mt-5 w-[500px] h-[530px] space-y-3"
      />
    </TPopup>

    <div v-if="!value.name">
      <TButton>Add Event</TButton>
    </div>

    <div v-else class="mb-[20px]">
      <!-- <div>Event Editor</div> -->

      <div class="flex flex-row justify-between align-middle font-semibold">
        <h1>{{ value.name }}</h1>
        <div>{{ value.startDate.replace('T', ' ') }}</div>
      </div>
      <div>{{ value.description }}</div>
      <br />

      <TButton @click="showEdit = !showEdit" allow-guests>Edit</TButton>
      <TButton @click="removeSchedule" allow-guests>Remove</TButton>

      <!-- <TInput v-model="value" label="Value" /> -->

      <!-- <pre>{{ value }}</pre> -->
    </div>
  </div>
</template>

<script>
import TPopup from '../TPopup.vue'
import TInputTextarea from './TInputTextarea.vue'
import TInputArray from './TInputArray.vue'
import TInput from './TInput.vue'
import TForm from '../TForm.vue'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default: 'placeholder',
    },
  },
  data: () => ({
    showEdit: false,
    schema: [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
      },
      {
        name: 'startDate',
        type: 'datetime-local',
        label: 'Start Date',
      },
      {
        name: 'endDate',
        type: 'datetime-local',
        label: 'End Date',
      },
      {
        name: 'description',
        label: 'Description',
        component: 'TInputTextarea',
        placeholder: 'Description',
      },
      {
        name: 'artists',
        component: 'TInputArray',
        children: {
          component: 'TInputProfile',
        },
      },
      {
        name: 'room',
        label: 'Room',
        component: 'TInputSelect',
        options: [
          {
            label: 'Room 1',
            value: 'room1',
          },
          {
            label: 'Room 2',
            value: 'room2',
          },
        ],

      },
      {
        name: 'danceStyle',
        type: 'dance-style',
        label: 'Dance Style',
        component: 'TInputStylesSelect2',
      },
    ],
  }),
  methods: {
    removeSchedule() {
      this.$emit('input', null)
    },
  },
  components: {
    TPopup,
    TInputTextarea,
    TInputArray,
    TInput,
    TForm,
  },
}
</script>

