<template>
  <div>
    <div class="flex justify-center py-8">
      <img src="/svg/undraw_video_files.svg" class="h-32" />
    </div>
    <div class="p-4">
      <h1 class="text-3xl font-extrabold text-center">
        Online Dance Competition
      </h1>
      <div class="text-center text-xl text-gray-700">
        Showcase your dance to win €300
      </div>
      <div class="text-center text-gray-700">
        and
        <router-link
          class="underline text-primary"
          to="/competition/rules#6-prizes"
          >special prizes</router-link
        >
        for participants in Munich
      </div>
    </div>
    <div class="p-4">
      <h2 class="text-3xl font-extrabold text-center mt-4 mb-2">
        Sponsored by
      </h2>
      <TPreview
        class="text-center"
        content="@MontunoClub @lakossa @kizztalkdanceacademy @the_social_dancer @marta @dancegodscompany.official @bachazouk_munich @Ernest @bavarian_bachata_congress"
      />
    </div>
    <div class="p-4">
      <h2 class="text-3xl font-extrabold text-center mt-4 mb-2">
        Timeline
      </h2>
      <div class="p-4">
        <ul class="list-disc">
          <li class="font-bold">Submission: 1-14 August 2024</li>
          <li>Voting: 15-28 August 2024</li>
          <li>Results: 1 September 2024</li>
        </ul>
      </div>
    </div>
    <div class="p-4">
      <h2 class="text-3xl font-extrabold text-center mt-4 mb-2">
        Who can participate?
      </h2>
      <div class="p-4">
        <ul class="list-disc">
          <li>You can be from any city</li>
          <li>
            You can choose
            <router-link class="underline text-primary" to="/dance/"
              >any style</router-link
            >
            that you have been dancing for at least three years
          </li>
        </ul>
      </div>
    </div>
    <div class="p-4">
      <h2 class="text-3xl font-extrabold text-center mt-4 mb-2">
        How to participate?
      </h2>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <UserCircleIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Enter the Contest</div>
          <div class="text-sm text-gray-700">
            Select your city, couple or solo, and your dance style.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <VideoCameraIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Record Your Video</div>
          <div class="text-sm text-gray-700">
            Follow
            <router-link
              class="underline text-primary"
              to="/competition/rules#3-video-requirements"
              >the guidelines</router-link
            >
            to record your dance performance video.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <UploadIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Submit Your Entry</div>
          <div class="text-sm text-gray-700">
            Upload your video to Youtube and submit the link to WeDance until 14
            August 2024.
          </div>
        </div>
      </div>
      <div class="flex justify-center py-4">
        <TButton
          type="primary"
          to="/competition/submit"
          :track="{ event: 'competition', action: 'start' }"
          >Get Started</TButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  VideoCameraIcon,
  UserCircleIcon,
  UploadIcon,
} from '@vue-hero-icons/outline'

export default {
  layout: 'full',
  components: {
    VideoCameraIcon,
    UserCircleIcon,
    UploadIcon,
  },
}
</script>
