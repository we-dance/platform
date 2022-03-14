<template>
  <TResizable>
    <template>
      <!-- v-slot:default="{ resize }" -->
      <div>
        <Editor @contentChanged="onChange" />
        <!-- v-model="input"
          v-bind="$attrs"
          class="block w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 font-mono leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
          @input="resize" -->
        <div
          v-if="max > 0"
          class="text-right text-sm text-gray-500"
          :class="{ 'text-red-500': value.length > max }"
        >
          {{ value.length }} / {{ max }}
        </div>
      </div>
    </template>
  </TResizable>
</template>

<script>
import Editor from '~/components/Editor.vue'
export default {
  name: 'TInputTextarea',
  props: {
    value: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    max: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    input: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
