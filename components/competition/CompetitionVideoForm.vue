<template>
  <div>
    <h1 class="text-xl font-extrabold p-4 text-center border-b">
      Upload Video
    </h1>
    <div class="p-4">
      <TPreview
        content="
**Record Your Video:**
- **Content:** Must feature a dance performance; all dance styles are welcome.
- **Format:** Videos must be recorded in horizontal (landscape) orientation.
- **Editing:** No cuts or post-production editing; the focus is on showcasing dance skills, not video editing skills.
- **Duration:** Duration of the song.
- **Quality:** Ensure high video and audio quality, preferably in HD (720p) or higher. The video should have clear audio and stable camera work.
- **Originality:** Must be an original performance specifically for the competition.
- **Music:** Use royalty-free music or tracks for which you have proper permissions.
- **Content Guidelines:** Ensure no copyrighted materials (visual or audio) are used without permission, and avoid any inappropriate or offensive content.
        "
      />

      <TForm
        ref="formRef"
        v-model="application"
        :fields="fields"
        class="space-y-4"
        hide-submit
      />
    </div>
    <div class="flex justify-center pb-4">
      <TButton type="primary" @click="submit">Submit Video</TButton>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import { db } from '~/plugins/firebase'
import { useAuth } from '~/use/auth'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const application = ref({})
    const formRef = ref(null)
    const { uid } = useAuth()

    const fields = ref([
      {
        name: 'video',
        label: 'Link to YouTube video',
        required: true,
        labelPosition: 'top',
      },
    ])

    async function submit() {
      if (!(await formRef.value.validate())) {
        return
      }

      await db
        .collection('competition')
        .doc(uid.value)
        .update({
          ...application.value,
          videoUploadedAt: +new Date(),
        })
    }

    return {
      formRef,
      application,
      fields,
      submit,
    }
  },
}
</script>
