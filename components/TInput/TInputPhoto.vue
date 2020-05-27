<template>
  <div>
    <div class="w-full flex flex-col items-center p-4">
      <img
        v-if="value"
        :src="value"
        :alt="name"
        class="rounded-full h-32 h-32"
      />
      <button
        class="underline text-blue-500 p-4 hover:no-underline"
        @click="showPopup = true"
      >
        {{ placeholder }}
      </button>
    </div>

    <TPopup v-if="showPopup" class="p-4">
      <label
        class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white"
      >
        <TIcon name="upload" class="w-8 h-8" />
        <span class="mt-2 text-base leading-normal">{{ selectLabel }}</span>
        <input
          type="file"
          class="hidden"
          accept="image/jpeg, image/png"
          @change="uploadPhoto"
        />
      </label>

      <div class="mt-4 bg-gray-200">
        <div
          class="border-b border-blue-500"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <div class="mt-4 flex justify-center">
        <TButton @click="showPopup = false">Cancel</TButton>
      </div>
    </TPopup>
  </div>
</template>

<script>
import useUpload from '~/use/upload'

export default {
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
    }
  },
  data: () => ({
    showPopup: false,
    progress: 0
  }),
  methods: {
    async uploadPhoto(event) {
      const file = event.target.files[0]

      const result = await this.upload(file, this.updateProgress)

      this.$emit('input', result.url)

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
