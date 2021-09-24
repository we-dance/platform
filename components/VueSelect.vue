<template>
  <div>
    <label class="block text-sm leading-5 font-medium text-gray-700">
      <slot name="SelectLabel"></slot>
    </label>

    <div v-click-outside="closeDropdown" class="relative z-10">
      <span class="inline-block w-full rounded-md shadow-sm">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          class="cursor-pointer relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
          @click="openDropdown"
        >
          <div class="flex items-center space-x-3">
            <span class="block truncate">
              {{ findLabel(value) }}
            </span>
          </div>
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
      </span>

      <!-- Select popover, show/hide based on select state. -->
      <div
        v-show="isOpen"
        class="absolute mt-1 w-full rounded-md bg-white shadow-lg"
      >
        <ul
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-item-3"
          class="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
        >
          <!--
            Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

            Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
          -->
          <li
            v-for="option in options"
            id="listbox-item-0"
            :key="getValue(option)"
            tabindex="0"
            role="option"
            class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 cursor-pointer hover:text-white hover:bg-indigo-600 focus:outline-none focus:text-white focus:bg-indigo-600"
            @click="select(getValue(option))"
          >
            <div class="flex items-center space-x-3">
              <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
              <span
                class="block truncate"
                :class="{
                  'font-normal': !isSelected(getValue(option)),
                  'font-semibold': isSelected(getValue(option)),
                }"
              >
                {{ getLabel(option) }}
              </span>
            </div>

            <!--
              Checkmark, only display for selected option.

              Highlighted: "text-white", Not Highlighted: "text-indigo-600"
            -->
            <span
              v-show="isSelected(getValue(option))"
              class="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </li>

          <!-- More options... -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { camelcase } from '~/utils'

export default {
  name: 'VueSelect',
  directives: {
    ClickOutside,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    isSelected(value) {
      return this.value === value
    },
    closeDropdown() {
      this.isOpen = false
    },
    openDropdown() {
      this.isOpen = true
    },
    select(value) {
      this.isOpen = false

      this.$emit('input', value)
    },
    findLabel(value) {
      const option = this.options?.find(
        (option) => this.getValue(option) === value
      )

      return this.getLabel(option)
    },
    getValue(field) {
      if (typeof field === 'string') {
        return field
      }

      if (field.value) {
        return field.value
      }

      return field.name
    },
    getLabel(field) {
      if (typeof field === 'string') {
        return camelcase(field)
      }

      if (field.label) {
        return field.label
      }

      return camelcase(field.name)
    },
  },
}
</script>
