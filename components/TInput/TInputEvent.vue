<template>
  <div>
    <div class="border-b mb-5 pb-3">
      <TPopup v-if="isEditing" title="Edit Event" @close="isEditing = false">
        <TForm
          v-model="internalValue"
          :fields="schema"
          allow-guests
          @save="save"
        />
      </TPopup>
      <div v-if="!value.name">
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
        <div class="block col-span-4">
          <div class="">{{ value.description }}</div>
          <div class="block">
            <div class="flex">
              <div v-for="artist in value.artists" :key="artist.username">
                <TProfileCardSmall :profile="artist" class=" mr-2" />
              </div>
            </div>
            <div v-if="value.styles" class="flex">
              <TStyles
                :value="value.styles"
                hide-level
                class="text-xs text-red-300 p-0 m-0"
              />
              <!-- <div
                v-for="(style, index) in value.styles"
                :key="index"
                class="rounded-full text-red-300 border px-2 py-1 text-xs mr-1 mt-1"
              >
                {{ index }}
              </div> -->
              <!-- {{ Object.keys(value.styles).join('') }} -->
              <!-- <pre>{{ iterate(value.styles) }}</pre> -->
            </div>
            <div v-else></div>
          </div>
        </div>
      </div>
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
    item: {
      type: Object,
      default: () => ({}),
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
            component: 'TInputSelectProfile',
            options: this.item.artists,
          },
        },
        {
          name: 'styles',
          labelPosition: 'top',
          label: this.$t('event.styles'),
          component: 'TInputStylesSelect2',
        },
      ],
    }
  },
  methods: {
    save(val) {
      this.$emit('input', val)
      this.isEditing = false
    },
    iterate(styles) {
      Object.keys(styles).join('')
    },
  },
}
</script>
