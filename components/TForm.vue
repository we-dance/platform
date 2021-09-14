<template>
  <div>
    <div v-for="field in visibleFields" :key="field.name" :class="fieldWrapper">
      <TField
        :value="value ? value[field.name] : ''"
        :item="value"
        v-bind="field"
        :label="getLabel(field)"
        @input="(val) => onFieldChange(field, val)"
      />
      <div
        v-if="v$.form[field.name].$errors[0]"
        class="text-red-500 py-2 text-left"
      >
        {{ $t(v$.form[field.name].$errors[0].$message) }}
      </div>
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
import { useVuelidate } from '@vuelidate/core'
import { camelcase } from '~/utils'
import { validators } from '~/use/validators'
import { useDoc } from '~/use/doc'
export default {
  name: 'TForm',
  components: {
    TField: () => import('~/components/TField'),
  },
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    fieldConfig: {
      type: Object,
      default: () => ({}),
    },
    submitLabel: {
      type: String,
      default: 'Save',
    },
    showCancel: {
      type: Boolean,
      default: false,
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
    editCreator: {
      type: Boolean,
      default: false,
    },
    fieldWrapper: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { find, exists } = useDoc('profiles')
    const isUnique = async (value) => {
      await find('username', value)
      if (exists.value) {
        return false
      } else {
        return true
      }
    }
    return { v$: useVuelidate(), find, exists, isUnique }
  },
  data() {
    return {
      form: this.value,
      error: true,
    }
  },
  validations() {
    const rules = Object.fromEntries(
      this.fields.map((field) => {
        if (field.validations) {
          const validations = Object.fromEntries(
            Object.entries(field.validations).map((name) => {
              if (name[0] === 'isUnique') {
                return [
                  name[0],
                  validators.helpers.withMessage(
                    `validation.${field.name}.${name[0]}`,
                    validators.helpers.withAsync(this.isUnique)
                  ),
                ]
              } else if (typeof name[1] !== 'boolean') {
                return [
                  name[0],
                  validators.helpers.withMessage(
                    `validation.${field.name}.${name[0]}`,
                    validators[name[0]](name[1])
                  ),
                ]
              } else {
                return [
                  name[0],
                  validators.helpers.withMessage(
                    `validation.${field.name}.${name[0]}`,
                    validators[name[0]]
                  ),
                ]
              }
            })
          )
          return [field.name, validations]
        } else {
          return [field.name, '']
        }
      })
    )
    return {
      form: rules,
    }
  },
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
          admin: true,
        })
      }
      return fields.map((f) => ({ ...f, ...this.fieldConfig }))
    },
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
      if (!this.v$) return true

      this.v$.$validate()

      if (this.v$.$error || this.v$.$pending || this.v$.$silentErrors[0]) {
        return false
      }

      return true
    },
    copy() {
      this.error = false
      if (!this.validate()) {
        return
      }
      this.$emit('copy', this.value)
    },
    save() {
      this.error = false
      if (!this.validate()) {
        return
      }
      this.$emit('save', this.value)
    },
    onFieldChange(field, value) {
      const val = { ...this.value }
      this.form[field.name] = value
      if (value) {
        this.$set(val, field.name, value)
      } else {
        this.$set(val, field.name, '')
      }
      if (field && field.onChange) {
        field.onChange(val)
      }
    },
  },
}
</script>
