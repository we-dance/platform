<template>
  <div v-if="hidden"></div>
  <div v-else :class="wrapperClasses" class="w-full grid">
    <div v-if="!hideLabel" :class="labelClasses">
      <label :for="elementId">
        <div v-if="tips" class="float-right">
          <TButton
            icon="help"
            type="icon"
            class="text-blue-500"
            @click="showTips = true"
          />
        </div>
        <div class="text-gray-700 font-bold">{{ label }}</div>
      </label>
    </div>
    <div :class="inputWrapperClasses">
      <slot name="top" />
      <TPreview
        v-if="before"
        :content="before"
        no-typo
        class="text-gray-500 text-sm mb-2"
      />
      <slot>
        <component
          :is="getComponent()"
          :id="elementId"
          v-bind="$attrs"
          :value.sync="computedValue"
          :type="type"
          :auto-focus="autoFocus"
          :hide-label="hideLabel"
          :item="item"
          v-on="$attrs.listeners"
          @input="(val) => $emit('input', set(val))"
        />
      </slot>
      <TPreview
        v-if="description"
        :content="description"
        no-typo
        class="text-gray-500 text-sm mt-2"
      />
      <slot name="bottom" />
    </div>
    <TPopup v-if="showTips" :title="label" @close="showTips = false">
      <TPreview :content="tips" class="my-4 max-w-sm" />
    </TPopup>
  </div>
</template>

<script>
import { camelize } from '~/utils'
import TInput from '~/components/TInput/TInput'
import TInputMarkdown from '~/components/TInput/TInputMarkdown'
import TInputSelect from '~/components/TInput/TInputSelect'
import TInputCollection from '~/components/TInput/TInputCollection'
import TInputMulti from '~/components/TInput/TInputMulti'
import TInputTags from '~/components/TInput/TInputTags'
import TInputTextarea from '~/components/TInput/TInputTextarea'
import TInputPhoto from '~/components/TInput/TInputPhoto'
import TAccountListSelector from '~/components/TAccountListSelector'
import TAccountSelector from '~/components/TAccountSelector'
import TInputPlace from '~/components/TInput/TInputPlace'
import TInputVenue from '~/components/TInput/TInputVenue'
import TInputZipcode from '~/components/TInput/TInputZipcode'
import TInputStyle from '~/components/TInput/TInputStyle'
import TInputStylesSelect2 from '~/components/TInput/TInputStylesSelect2'
import TInputLanguages from '~/components/TInput/TInputLanguages'
import TInputButtons from '~/components/TInput/TInputButtons'
import TInputUsername from '~/components/TInput/TInputUsername'
import TInputDateTime from '~/components/TInput/TInputDateTime'

export default {
  name: 'TField',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Object, Array, Number, Date],
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    before: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: 'left'
    },
    type: {
      type: String,
      default: 'text'
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    default: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    hideLabel: {
      type: Boolean,
      default: false
    },
    get: {
      type: Function,
      default: (val) => val
    },
    set: {
      type: Function,
      default: (val) => val
    }
  },
  data: () => ({
    elementId: '',
    showTips: false
  }),
  computed: {
    computedValue() {
      return this.get(this.value)
    },
    hidden() {
      return this.type === 'hidden'
    },
    wrapperClasses() {
      const map = {
        top: 'grid-cols-1',
        left: 'grid-cols-12 gap-2'
      }

      return map[this.labelPosition]
    },
    labelClasses() {
      const map = {
        top: 'col-span-12',
        left: 'col-span-12 text-left lg:text-right lg:col-span-4'
      }

      return map[this.labelPosition]
    },
    inputWrapperClasses() {
      const map = {
        top: 'col-span-12',
        left: 'col-span-12 lg:col-span-8'
      }

      const labelPosition = this.hideLabel ? 'top' : this.labelPosition

      return map[labelPosition]
    }
  },
  mounted() {
    this.elementId = camelize(this.label)

    if (!this.value && this.default) {
      this.$emit('input', this.default)
    }
  },
  methods: {
    getComponent() {
      const map = {
        tags: TInputTags,
        select: TInputSelect,
        richselect: 't-rich-select',
        markdown: TInputMarkdown,
        textarea: TInputTextarea,
        photo: TInputPhoto,
        place: TInputPlace,
        venue: TInputVenue,
        zipcode: TInputZipcode,
        multi: TInputMulti,
        collection: TInputCollection,
        radio: 't-radio-group',
        accounts: TAccountListSelector,
        account: TAccountSelector,
        style: TInputStyle,
        stylesSelect: TInputStylesSelect2,
        languages: TInputLanguages,
        buttons: TInputButtons,
        username: TInputUsername,
        datetime: TInputDateTime
      }

      return map[this.type] || TInput
    }
  }
}
</script>
