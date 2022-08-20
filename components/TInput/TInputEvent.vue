<template>
  <div v-if="isEditing">
    <TForm v-model="internalValue" :fields="schema" allow-guests @save="save" />
  </div>
  <div v-else-if="!value.name">
    <TButton allow-guests @click="isEditing = true">Add Event</TButton>
  </div>
  <div v-else class="flex">
    <div class="block">
      <div class="block">
        <strong>{{ value.name }} </strong>
      </div>
      <div>Starts at {{ value.startDate }}</div>
      <div>Ends at {{ value.endDate }}</div>
      <div>{{ value.description }}</div>
      <br />
    </div>
    <div>
      <TDropdown v-slot="{ closeMenu }">
        <TButton
          allow-guests
          type="context"
          :label="$t('TInputProfile.remove')"
          color="red-500 text-sm"
          @click="
            $emit('input', {})
            closeMenu()
          "
        />
        <TButton
          allow-guests
          type="context"
          label="Edit"
          color=" text-sm"
          @click="
            internalValue = value
            isEditing = true
            closeMenu()
          "
        />
      </TDropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, String],
      default: () => ({}),
    },
    placeholder: {
      type: String,
      default() {
        return this.$t('TInputProfile.placeholder')
      },
    },
  },
  data() {
    return {
      internalValue: {},
      isEditing: false,
      schema: [
        {
          name: 'name',
          labelPosition: 'top',
          placeholder: this.$t('event.name.placeholder'),
          label: this.$t('event.name.label'),
        },
        {
          name: 'startDate',
          type: 'datetime-local',
          labelPosition: 'top',
          label: this.$t('event.startDate'),
          simple: true,
        },
        {
          name: 'endDate',
          type: 'datetime-local',
          labelPosition: 'top',
          label: this.$t('event.endDate'),
          simple: true,
        },
        {
          name: 'description',
          label: this.$t('event.description.label'),
          labelPosition: 'top',
          component: 'TInputTextarea',
          placeholder: this.$t('event.description.placeholder'),
          max: 140,
        },
      ],
    }
  },
  methods: {
    save(val) {
      this.$emit('input', val)
      this.isEditing = false
    },
  },
}
</script>
