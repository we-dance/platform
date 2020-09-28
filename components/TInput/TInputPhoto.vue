<template>
  <div>
    <div class="w-full flex flex-col items-center p-4">
      <img
        v-if="value"
        :src="value"
        :alt="name"
        class="h-32"
        :class="{ 'rounded-full': circle }"
      />
      <button
        class="underline text-blue-500 p-4 hover:no-underline"
        @click="showPopup = true"
      >
        {{ placeholder }}
      </button>
    </div>

    <TPopup v-if="showPopup" class="p-4">
      <div :class="!editing ? 'cursor-pointer' : ''">
        <croppa
          v-model="croppa"
          :width="width"
          :height="height"
          prevent-white-space
          :show-remove-button="false"
          :placeholder="selectLabel"
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

      <div class="mt-4 flex justify-between">
        <TButton @click="showPopup = false">Cancel</TButton>
        <TButton type="secondary" @click="clear()">Clear</TButton>
        <TButton type="primary" @click="save()">Save</TButton>
      </div>
    </TPopup>
  </div>
</template>

<script>
import Croppa from 'vue-croppa'
import useUpload from '~/use/upload'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'TInputPhoto',
  components: {
    croppa: Croppa.component
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Change photo'
    },
    selectLabel: {
      type: String,
      default: 'Upload photo'
    },
    item: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    circle: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    showPopup: false,
    progress: 0,
    croppa: {}
  }),
  computed: {
    editing() {
      return (
        this.croppa &&
        this.croppa.getChosenFile &&
        !!this.croppa.getChosenFile()
      )
    }
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
    }
  },
  setup() {
    const { upload } = useUpload()

    return {
      upload
    }
  }
}
</script>
