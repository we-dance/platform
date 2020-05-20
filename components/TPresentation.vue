<template>
  <TPopup v-if="slide == 1" @close="close">
    <div class="p-4 text-center">
      <TIcon class="w-64" name="logo" />
      <div class="mt-8 w-64">
        <p>
          Welcome to community platform for dancers.
        </p>
        <div class="mt-8 flex justify-end">
          <TButton @click="slide = 2">Next</TButton>
        </div>
      </div>
    </div>
  </TPopup>

  <TPopup v-else-if="slide == 2" @close="close">
    <div class="p-4 text-center">
      <TIcon class="w-64" name="undraw_newspaper" />
      <div class="mt-8 w-64">
        <p>
          Dance news of your city: discounts, street festivals and spontaneous
          meetups
        </p>
        <div class="mt-8 flex justify-end">
          <TButton @click="slide = 3">Next</TButton>
        </div>
      </div>
    </div>
  </TPopup>

  <TPopup v-else-if="slide == 2" @close="close">
    <div class="p-4 text-center">
      <TIcon class="w-64" name="undraw_work_chat" />
      <div class="mt-8 w-64">
        <p>
          Ask questions and participate in discussions about dancing
        </p>
        <div class="mt-8 flex justify-end">
          <TButton @click="slide = 3">Next</TButton>
        </div>
      </div>
    </div>
  </TPopup>

  <TPopup v-else-if="slide == 3" @close="close">
    <div class="p-4 text-center">
      <TIcon class="w-64" name="undraw_video_files" />
      <div class="mt-8 w-64">
        <p>
          Inspiration and interesting links
        </p>
        <div class="mt-8 flex justify-end">
          <TButton @click="slide = 4">Next</TButton>
        </div>
      </div>
    </div>
  </TPopup>

  <TPopup v-else-if="slide == 4" @close="close">
    <div class="p-4 text-center">
      <TIcon class="w-64" name="undraw_dua_lipa" />
      <div class="mt-8 w-64">
        <p>
          Upcoming events and festivals
        </p>
        <div class="mt-8 flex justify-end">
          <TButton to="/posts/hpHquGrQKthCaGBizAZB" class="mr-2"
            >Read more</TButton
          >
          <TButton @click="close">Close</TButton>
        </div>
      </div>
    </div>
  </TPopup>
</template>

<script>
import ls from 'local-storage'
import TPopup from '~/components/TPopup'
import TIcon from '~/components/TIcon'
import TButton from '~/components/TButton'

export default {
  components: {
    TPopup,
    TIcon,
    TButton
  },
  data: () => ({
    slide: 1
  }),
  mounted() {
    this.slide = 1

    ls('sawIntro', true)
  },
  methods: {
    close() {
      this.$emit('close')
      this.$router.replace('/')
    }
  }
}
</script>
