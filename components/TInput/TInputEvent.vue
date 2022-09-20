<!-- components/TInput/TInputEvent.vue -->

<template>
  <div>
    <TPopup v-if="showEdit">
      <div class="schedule-header">
        <h1>Edit</h1>
        <h1 class="improv-x" @click="showEdit = false">X</h1>
      </div>
      <div class="schedule-editor">
        <label>Name</label>
        <TInput v-model="value.name" label="Name" />
        <br />

        <label>Start Date</label>
        <TInput
          v-model="value.startDate"
          type="datetime-local"
          label="Start Date"
        />
        <br />

        <label>End Date</label>
        <TInput
          v-model="value.endDate"
          type="datetime-local"
          label="End Date"
        />
        <br />

        <label>Description</label>
        <TInputTextarea v-model="value.description" label="Description" />
        <br />

        <label>Artists</label>
        <TAccountListSelector v-model="value.artists" label="Artists" />

        <br />

        <label>Room</label>
        <TInput v-model="value.room" label="Room" />
        <br />

        <label>Dance Style</label>
        <TInputStylesSelect2 v-model="value.danceStyle" label="Dance Style" />
        <br />
      </div>
    </TPopup>

    <div v-if="!value.name">
      <TButton>Add Event</TButton>
    </div>

    <div v-else class="edit">
      <!-- <div>Event Editor</div> -->

      <div class="event-heading">
        <h1>{{ value.name }}</h1>
        <div>{{ value.startDate }}</div>
      </div>
      <div>{{ value.description }}</div>
      <br />

      <TButton @click="showEdit = !showEdit">Edit</TButton>
      <TButton @click="removeSchedule">Remove</TButton>

      <!-- <TInput v-model="value" label="Value" /> -->

      <!-- <pre>{{ value }}</pre> -->
    </div>
  </div>
</template>

<script>
import TPopup from '../TPopup.vue'
import TAccountListSelector from '../TAccountListSelector.vue'
import TInputTextarea from './TInputTextarea.vue'
import TInput from './TInput.vue'

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
  }),
  methods: {
    removeSchedule() {
      this.$emit('input', null)
    },
  },
  components: {
    TPopup,
    TInputTextarea,
    TAccountListSelector,
    TInput,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit {
  margin-bottom: 20px;
}

.event-heading {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.schedule-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-top: 30px;
}

.schedule-editor h1 {
  font-weight: 700;
}

.improv-x {
  font-weight: 700;

  cursor: pointer;
}

.schedule-editor {
  margin-top: 20px;
  width: 500px;
  height: 500px;
}
</style>
