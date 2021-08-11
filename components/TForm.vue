<template>
  <div>
    <div v-for="field in visibleFields" :key="field.name" :class="fieldWrapper">
      <TField
        :value="value ? value[field.name] : ''"
        :item="value"
        v-bind="field"
        :error="usernameError"
        :label="getLabel(field)"
        @input="(val) => onFieldChange(field, val)"
      />
    </div>
    <div v-if="error" class="text-red-500 py-4 text-right">
      {{ error.message }}
    </div>
    <slot name="bottom" />
    <div
      class="flex justify-end space-x-2 bg-white py-4 border-t z-10 items-center bottom-0 sticky"
    >
      <TButton v-if="showRemove" label="Delete" @click="remove" />
      <TButton v-if="showCancel" label="Cancel" @click="cancel" />
      <TButton v-if="showCopy" label="Copy" @click="copy" />
      <slot name="buttons" />
      <TButton
        v-if="submitLabel"
        type="primary"
        :label="submitLabel"
        @click="save"
      />
    </div>
  </div>
</template>

<script>
import { camelcase } from '~/utils'
import { useDoc } from '~/use/doc'

export default {
  name: 'TForm',
  setup() {
    const { find, id } = useDoc('profiles')

    return {
      find,
      id
    }
  },
  components: {
    TField: () => import('~/components/TField')
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({})
    },
    fieldConfig: {
      type: Object,
      default: () => ({})
    },
    submitLabel: {
      type: String,
      default: 'Save'
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showCopy: {
      type: Boolean,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: false
    },
    editCreator: {
      type: Boolean,
      default: false
    },
    fieldWrapper: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    error: false,
    usernameError: ''
  }),
  computed: {
    visibleFields() {
      const fields = this.fields
        .filter((f) => f)
        .filter((field) => !field.when || field.when(this.value))

      if (this.editCreator) {
        fields.push({
          name: 'createdBy',
          label: 'Creator',
          type: 'collection',
          collection: 'profiles',
          keyValue: 'id',
          keyLabel: 'username',
          orderBy: 'username',
          canAdd: true,
          admin: true
        })
      }

      return fields.map((f) => ({ ...f, ...this.fieldConfig }))
    }
  },
  methods: {
    remove() {
      this.$emit('remove', this.value.id)
    },
    cancel() {
      this.$emit('cancel')
    },
    getLabel(field) {
      if (typeof field === 'string') {
        return camelcase(field)
      }

      if (field.key) {
        return this.$t(field.key)
      }

      if (field.label) {
        return field.label
      }

      return camelcase(field.name)
    },
    validate() {
      return true
    },
    copy() {
      this.error = false

      if (!this.validate()) {
        return
      }

      this.$emit('copy', this.value)
    },
    async save() {
      this.error = false

      if (!this.validate()) {
        return
      }

      await this.find('username', this.value.username)

      if (this.id && this.id !== this.value.id) {
        this.usernameError = 'This name is already taken'
        this.$emit('input', this.value)
        return
      }

      this.$emit('save', this.value)
    },
    onFieldChange(field, value) {
      this.usernameError = ''
      const val = { ...this.value }
      if (value) {
        this.$set(val, field.name, value)
      } else {
        this.$set(val, field.name, '')
      }

      if (field && field.onChange) {
        field.onChange(val)
      }
      this.$emit('input', val)
    }
  }
}
</script>
