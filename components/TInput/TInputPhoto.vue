<template>
  <div>
    <div class="flex w-full flex-col items-center">
      <img
        v-if="value"
        :src="value"
        :alt="name"
        class="w-full"
        :class="{ 'rounded-full': circle }"
      />
      <button
        class="p-4 text-blue-500 underline hover:no-underline"
        @click="showPopup = true"
      >
        {{ placeholder || $t('photo.placeholder') }}
      </button>
    </div>

    <TPopup
      v-if="showPopup"
      :title="selectLabel || $t('photo.selectLabel')"
      @close="showPopup = false"
    >
      <div class="overflow-hidden p-4">
        <div :class="!editing ? 'cursor-pointer' : ''" class="mx-auto">
          <croppa
            v-model="croppa"
            :width="width"
            :height="height"
            prevent-white-space
            :show-remove-button="false"
            :placeholder="selectLabel || $t('photo.selectLabel')"
          />
        </div>

        <div v-if="editing" class="mt-4 flex justify-center">
          <button class="cursor-pointer" @click="rotate()">
            <TIcon name="rotate_right" class="h-8 w-8" />
          </button>
        </div>

        <div class="mt-4 bg-gray-200">
          <div
            class="border-b border-blue-500"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <TButton @click="clear()">{{ $t('form.clear') }}</TButton>
          <TButton type="primary" @click="save()">{{
            $t('form.save')
          }}</TButton>
        </div>
      </div>
    </TPopup>
  </div>
</template>

<script>
import Croppa from 'vue-croppa'
import { useUpload } from '~/use/upload'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'TInputPhoto',
  components: {
    croppa: Croppa.component,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    selectLabel: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: Number,
      default: 300,
    },
    height: {
      type: Number,
      default: 300,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showPopup: false,
    progress: 0,
    croppa: {},
  }),
  computed: {
    editing() {
      return (
        this.croppa &&
        this.croppa.getChosenFile &&
        !!this.croppa.getChosenFile()
      )
    },
  },
  methods: {
    rotate() {
      this.croppa.rotate(1)
    },
    save() {
      this.croppa.generateBlob(this.uploadPhoto, 'image/jpeg', 0.8)
    },
    async uploadPhoto(file) {
      const result = await this.upload(file, this.updateProgress)

      this.$emit('input', result.url)

      this.showPopup = false
      this.progress = 0
    },
    clear() {
      this.$emit('input', '')
      this.showPopup = false
      this.progress = 0
    },
    updateProgress(snapshot) {
      const { bytesTransferred, totalBytes } = snapshot
      this.progress = (bytesTransferred / totalBytes) * 100
    },
  },
  setup() {
    const { upload } = useUpload()

    return {
      upload,
    }
  },
}
</script>
