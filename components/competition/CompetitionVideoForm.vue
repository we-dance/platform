<template>
  <div>
    <h1 class="text-xl font-extrabold p-4 text-center border-b">
      Upload Video
    </h1>
    <div class="p-4">
      <TPreview
        content="
**Record Your Video:**
- **Content:** Must feature a dance performance; all dance styles are welcome. Only the participants should be visible in the video—no other people dancing or appearing in the background.
- **Format:** Videos must be recorded in horizontal (landscape) orientation.
- **Editing:** No cuts or post-production editing; the focus is on showcasing dance skills, not video editing skills.
- **Duration:** Duration of the song.
- **Quality:** Ensure high video and audio quality, preferably in HD (720p) or higher. The video should have clear audio and stable camera work.
- **Originality:** Must be an original performance specifically for the competition.
- **Music:** Use royalty-free music or tracks for which you have proper permissions.
- **Content Guidelines:** Ensure no copyrighted materials (visual or audio) are used without permission, and avoid any inappropriate or offensive content.
        "
      />

      <p class="font-bold">
        Important: Include This Description in Your YouTube or Instagram Video:
      </p>
      <pre class="bg-gray-100 text-wrap rounded p-2">
WeDance Global Video Dance Competition 2024.

I’m excited to be part of the competition! This is my submission in the {{
          value.style
        }} Dance {{
          value.category
        }} category. Help support my entry by liking, sharing, and voting. Let’s celebrate the diversity and creativity of dance worldwide! 💃🕺

Dancers:
💃 [Your Name] [@yourusername]
🕺 [Your Partner’s Name] [@partnerusername]

Videography:
🎥 [Videographer’s Name] [@videographerusername]

Song:
Original Version by: [Original Artist Name]
Remix by: [Remixer’s Name]
YouTube/Song Link

Disclaimer:
This video is strictly for the promotional purpose of showcasing {{
          value.style
        }} Dance. We do NOT own the rights to this music; it is used only to highlight the creativity of the artists and dancers involved.
NO COPYRIGHT INFRINGEMENT INTENDED.

#WeDanceCompetition #{{
          value.style
        }}Dance #DanceChallenge  #DanceVideo #WeDance
</pre
      >

      <TForm
        ref="formRef"
        v-model="application"
        :fields="fields"
        class="space-y-4 p-4"
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
  setup(props, { root }) {
    const application = ref({})
    const formRef = ref(null)
    const { uid } = useAuth()

    const fields = ref([
      {
        name: 'video',
        label: 'Link to YouTube or Instagram video',
        required: true,
        labelPosition: 'top',
      },
    ])

    async function submit() {
      if (!(await formRef.value.validate())) {
        root.$track('competition_video_submit_error')
        return
      }

      await db
        .collection('competition')
        .doc(uid.value)
        .update({
          ...application.value,
          videoUploadedAt: +new Date(),
        })

      root.$track('competition_video_submit')
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
