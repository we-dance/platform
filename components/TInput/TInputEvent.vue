<template>
  <div class="border-b mb-5 ">
    <div v-if="isEditing">
      <TForm
        v-model="internalValue"
        :fields="schema"
        allow-guests
        @save="save"
      />
    </div>
    <div v-else-if="!value.name">
      <TButton allow-guests @click="isEditing = true">Add Event</TButton>
    </div>
    <div v-else class="grid grid-cols-5">
      <div class=" ">
        <strong> {{ value.startDate }} </strong>
      </div>
      <div class=" col-span-2">
        <strong>{{ value.name }}</strong>
      </div>
      <div></div>
      <div class="flex justify-end">
        <TDropdown v-slot="{ closeMenu }">
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
        </TDropdown>
      </div>
      <div></div>

      <div class=" col-span-4 mb-5">{{ value.description }}</div>
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
          type: 'time',
          labelPosition: 'top',
          label: this.$t('event.startDate'),
          simple: true,
        },
        {
          name: 'endDate',
          type: 'time',
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
        {
          name: 'artists',
          component: 'TInputArray',
          children: {
            component: 'TInputSelect',
          },
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
