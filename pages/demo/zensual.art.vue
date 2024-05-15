<template>
  <div>
    <THeader show-logo class="md:hidden" />

    <div class="rounded overflow-hidden">
      <mux-player
        playback-id="exizM1SgPwP6Fw81egITz9sF1irYxvRL1nNsXr9bbiM"
        metadata-video-title="Placeholder (optional)"
        metadata-viewer-user-id="user-id-vue3007"
        accent-color="#F1023D"
      />

      <TCollapseItem class="border-b mt-[-5px]" :title="statusLine">
        <div class="border divide-y overflow-hidden">
          <TPlayControls
            v-for="(chapter, index) in chapters"
            :key="chapter.id"
            :title="`${index + 1}. ${chapter.title}`"
            :current="current"
            :video-id="chapter.id"
            :duration="chapter.duration"
            :locked="chapter.locked"
            @click.native="switchVideo(chapter.id)"
          />
        </div>
      </TCollapseItem>
    </div>

    <WTeaserBig
      header="Ecstasy of Sensuality"
      description="Elegance, majesty, expression. Amazing cuban dancer Yarima Rodríguez shares her secrets for mastering Lady Styling in Son Cubano, helping you enhance your dance technique and unleash your inner grace."
      button="Enroll"
      button-after="Starting at €10/month for all classes and sessions"
      class="p-4"
    >
      <template slot="preheader">
        <div class="flex justify-center gap-1 text-xs uppercase">
          <div class="text-primary">
            Online
          </div>
          <div>·</div>
          <div>
            Lady Styling · Salsa Cubana · Son
          </div>
        </div>
      </template>
      <template slot="subheader">
        <div class="flex justify-center gap-1 text-xs my-2">
          <div>
            2 hours
          </div>
          <div>·</div>
          <div>
            2 students
          </div>
          <div>·</div>
          <div>
            10 views
          </div>
        </div>
      </template>
    </WTeaserBig>

    <section class="p-4 border-t border-primary">
      <div class="space-y-2">
        <h3 class="uppercase text-xs text-primary font-extrabold">
          Meet Your Instructor
        </h3>
        <WProfile username="zensual.art" hide-role class="border-none" />
      </div>
    </section>

    <section class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        Why Choose This Course?
      </h3>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Expert Guidance</div>
          <div class="text-sm text-gray-700 has-links">
            Benefit from Yarima's expertise in Cuban dance, crafted into
            detailed, easy-to-follow video tutorials.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Learn at Your Pace</div>
          <div class="text-sm text-gray-700 has-links">
            Access the entire course content at once and progress through the
            lessons at your own pace.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Global Access</div>
          <div class="text-sm text-gray-700 has-links">
            Enjoy the convenience of accessing the course from anywhere in the
            world, allowing you to learn from any location and on any device.
          </div>
        </div>
      </div>
    </section>

    <section class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        What You Will Learn
      </h3>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Core Techniques of Lady Styling</div>
          <div class="text-sm text-gray-700 has-links">
            Master the fundamental movements and stylistic nuances specific to
            Son Cubano.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Enhanced Dance Mechanics</div>
          <div class="text-sm text-gray-700 has-links">
            Improve your body alignment, elegance in hand movements, and
            precision in footwork.
          </div>
        </div>
      </div>
      <div class="flex gap-4 items-start mb-4">
        <div>
          <HeartIcon class="mt-1 text-primary w-6" />
        </div>
        <div>
          <div class="text-lg font-bold">Performance and Expression</div>
          <div class="text-sm text-gray-700 has-links">
            Elevate your dance expression, learning to convey stories and
            emotions seamlessly through your movements.
          </div>
        </div>
      </div>
    </section>

    <section class="p-4 border-t border-primary">
      <h3 class="uppercase text-xs text-primary font-extrabold py-4">
        Who Should Enroll?
      </h3>
      <div class="text-sm text-gray-700 has-links">
        This course is perfect for dancers with some experience in Son Cubano
        who want to enhance their lady styling skills. If you're looking to
        refine your routines and learn at your own pace, this course is tailored
        for you. Join us to elevate your dance performance with stylish,
        polished moves.
      </div>
    </section>

    <WTeaserBig
      header="Enroll Now"
      description="Step into the world of Son Cubano and transform your dance technique. Register today to start learning immediately and at your own pace!"
      button="Enroll"
      button-after="Starting at €10/month for all classes and sessions"
      class="p-4 border-t"
    />
  </div>
</template>

<script>
import '@mux/mux-player'
import { HeartIcon } from '@vue-hero-icons/outline'

export default {
  name: 'MuxDemo',
  layout: 'full',
  components: {
    HeartIcon,
  },
  data: () => ({
    current: '1',
    chapters: [
      {
        id: '1',
        title: 'Intro',
        duration: '1:12',
      },
      {
        id: '2',
        title: 'Warm-up (part 1)',
      },
      {
        id: '3',
        title: 'Warm-up (part 2)',
        locked: true,
      },
      {
        id: '4',
        title: 'Phrase (segment 1)',
        locked: true,
      },
      {
        id: '5',
        title: 'Phrase (segment 2)',
        locked: true,
      },
      {
        id: '6',
        title: 'Phrase (segment 3)',
        locked: true,
      },
      {
        id: '7',
        title: 'Phrase (segment 4)',
        locked: true,
      },
      {
        id: '8',
        title: 'Continued Phrase (without music)',
        locked: true,
      },
      {
        id: '9',
        title: 'Details of the arms',
        locked: true,
      },
      {
        id: '10',
        title: 'Details of the legs',
        locked: true,
      },
      {
        id: '11',
        title: 'Stretching',
        locked: true,
      },
    ],
  }),
  computed: {
    activeChapter() {
      return this.chapters.find((chapter) => chapter.id === this.current)
    },
    statusLine() {
      const activeChapterIndex =
        this.chapters.findIndex((chapter) => chapter.id === this.current) + 1

      const totalChapters = this.chapters.length

      return `Chapter ${activeChapterIndex} of ${totalChapters}: ${this.activeChapter.title}`
    },
  },
  methods: {
    switchVideo(videoId) {
      this.current = videoId
    },
  },
}
</script>
